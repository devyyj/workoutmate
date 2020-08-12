import { Router } from 'express'
const fs = require('fs')
const path = require('path')
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const proxy = require('proxy-agent')
const user = require('../models/user')
const config = require('../config')
const passport = require('../passport')

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    const extArray = file.mimetype.split('/')
    const extension = extArray[extArray.length - 1]
    cb(null, Date.now() + '.' + extension)
  },
})
const upload = multer({ storage })

if (process.env.PROXY) {
  AWS.config.update({
    httpOptions: { agent: proxy(process.env.PROXY) },
  })
}
AWS.config.update({ region: 'ap-northeast-2' })
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const router = Router()

// 사용자 정보를 가져온다. 로그인 상태가 아니어도 API를 사용할 수 있어야 한다.
// 따라서 인증 미들웨어 추가하지 않는다.
router.get('/user', async (req, res) => {
  try {
    res.send(await user.findOne({ where: { id: req.query.id } }))
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

// 처음 로그인할 경우에 user 정보를 생성한다.
// 따라서 인증 미들웨어 추가하지 않는다. (토큰이 생기기 전이다)
router.post('/user', async (req, res) => {
  try {
    const data = req.body
    if (!(await user.findOne({ where: { id: data.id } }))) {
      await user.create({ id: data.id, nick_name: data.id })
    }
    res
      .cookie('jwt', jwt.sign({ id: data.id }, 'secret'), {
        domain: config.domain,
        httpOnly: true,
      })
      .sendStatus(200)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }
})

router.post(
  '/user/upload-image',
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  async (req, res) => {
    try {
      if (['image/png', 'image/jpeg'].includes(req.file.mimetype) === false)
        throw new Error('not image file')
      console.log(req.file)
      // 파일 읽기
      const file = req.file.path
      const fileStream = fs.createReadStream(file)
      fileStream.on('error', function (err) {
        console.log('File Error', err)
      })
      // s3 업로드 설정
      const uploadParams = {
        Bucket: 'workoutmate-user-image',
        Body: fileStream,
        Key: path.basename(file),
      }
      // 파일 업로드
      const data = await s3.upload(uploadParams).promise()
      if (data) {
        console.log('Upload Success', data.Location)
        // 서버에 보관하고 있는 파일 삭제(S3에 업로드 했으므로)
        fs.unlinkSync(file)
        // picture 정보 업데이트
        await user.update(
          { picture: data.Location },
          { where: { id: req.user.id } }
        )
      }
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      if (error.message === 'not image file') res.sendStatus(400)
      else res.sendStatus(500)
    }
  }
)

router.patch(
  '/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const data = req.body
      await user.update(
        { nick_name: data.nick_name, infomation: data.infomation },
        { where: { id: req.user.id } }
      )
      res.sendStatus(200)
    } catch (error) {
      if (error.errors[0].type === 'unique violation') res.sendStatus(400)
      else res.sendStatus(500)
    }
  }
)

router.delete(
  '/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await user.destroy({ where: { id: req.user.id } })
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  }
)

module.exports = router

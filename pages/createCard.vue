<template>
  <div>
    <!-- validated-->
    <b-form id="cardForm" novalidate @submit="onSubmit">
      <b-form-group
        id="input-group-0"
        label="닉네임"
        label-for="input-0"
        description="설정에서 닉네임을 변경할 수 있습니다."
      >
        <b-form-input
          id="input-0"
          v-model="card.nick_name"
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1" label="함께할 운동" label-for="input-1">
        <b-form-select
          id="input-1"
          v-model="card.type"
          :options="options"
          :state="typeState"
        ></b-form-select>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="운동 스타일"
        label-for="tags-pills"
        description="태그 길이는 최대 10자까지, 태그 수는 최대 10개까지입니다."
      >
        <b-form-tags
          v-model="card.detail"
          input-id="tags-pills"
          tag-variant="primary"
          tag-pills
          separator=" "
          placeholder="띄어쓰기로 태그를 구분하세요."
          class="mb-2"
          :state="detailState"
          :tag-validator="detailValidator"
          remove-on-delete
        ></b-form-tags>
      </b-form-group>

      <b-form-group
        id="input-group-3"
        label="운동 시간 그리고 장소"
        label-for="input-3"
      >
        <b-form-datepicker
          id="example-datepicker"
          v-model="card.date"
          class="mb-2"
        ></b-form-datepicker>
        <b-form-timepicker
          id="example-timepicker"
          v-model="card.time"
          locale="kr"
          class="mb-2"
        ></b-form-timepicker>
        <b-form-input
          id="input-3"
          v-model="card.location"
          placeholder="운동 장소를 입력하세요."
          :state="locationState"
        ></b-form-input>
      </b-form-group>

      <b-form-row>
        <b-col>
          <b-form-group
            id="input-group-4"
            label="모집 인원"
            label-for="input-4"
            description="최소 1명, 최대 99명입니다."
          >
            <b-form-input
              id="input-4"
              v-model="card.max"
              type="number"
              pattern="\d*"
              :state="maxState"
            ></b-form-input>
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group
            id="input-group-5"
            label="비용"
            label-for="input-5"
            description="최소 0원, 최대 100만 원입니다."
          >
            <b-form-input
              id="input-5"
              v-model="card.cost"
              type="number"
              pattern="\d*"
              :state="costState"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-form-row>

      <b-form-group
        id="input-group-6"
        label="하고 싶은 말"
        label-for="textarea-no-resize"
      >
        <b-form-textarea
          id="textarea-no-resize"
          v-model="card.content"
          placeholder="본문을 작성해 주세요."
          rows="3"
          no-resize
          maxlength="251"
          :state="contentState"
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary" :disabled="wait">등록</b-button>
      <b-button type="reset" variant="danger" @click="onCancel">취소</b-button>
    </b-form>
  </div>
</template>

<script>
import m from 'moment'
import { getMyid } from '../common/common'

export default {
  data() {
    return {
      card: {
        user_id: '',
        nick_name: '',
        content: '',
        date: m().format('YYYY-MM-DD'),
        time: m().format('HH:mm:ss'),
        location: '',
        cost: '0',
        max: '1',
        detail: [],
        type: null,
      },
      wait: false,
      options: [
        { value: null, text: '운동을 선택해 주세요.' },
        { value: '헬스', text: '헬스' },
        { value: '기타', text: '기타' },
      ],
    }
  },
  computed: {
    // state()로 유효성 체크
    detailState() {
      const length = this.card.detail.length
      return length === 0 ? null : length <= 10
    },
    typeState() {
      return this.card.type !== null
    },
    locationState() {
      return this.card.location.length > 0
    },
    maxState() {
      return this.card.max > 0 && this.card.max < 100
    },
    costState() {
      return (
        this.card.cost >= 0 &&
        this.card.cost <= 1000000 &&
        this.card.cost.length !== 0
      )
    },
    contentState() {
      return this.card.content.length !== 0 && this.card.content.length <= 250
    },
  },
  async mounted() {
    try {
      if (this.$route.query.id) {
        // 카드 수정
        const card = await this.$axios.$get(`/cards?id=${this.$route.query.id}`)
        this.card.user_id = card.user_id
        this.card.nick_name = card.user.nick_name
        this.card.content = card.content
        this.card.date = m(card.time).format('YYYY-MM-DD')
        this.card.time = m(card.time).format('HH:mm:ss')
        this.card.location = card.location
        this.card.cost = card.cost
        this.card.max = card.max
        this.card.detail = card.detail.split(',')
        this.card.type = card.type
      } else {
        // 카드 생성
        const myid = await getMyid(this)
        const data = await this.$axios.$get(`/users?id=${myid}`)
        this.card.nick_name = data.nick_name
      }
    } catch (error) {
      alert(error)
    }
  },
  methods: {
    async onSubmit(evt) {
      try {
        evt.preventDefault()
        // validation, 유효성 검증
        if (
          !(
            this.typeState &&
            this.locationState &&
            this.maxState &&
            this.costState &&
            this.detailState !== false
          )
        ) {
          alert('카드 양식이 올바르지 않습니다.')
          return
        }
        this.wait = true
        // 카드 생성, 수정
        if (this.$route.query.id) {
          this.card.id = this.$route.query.id
          await this.$axios.$patch('/cards', this.card)
        } else {
          await this.$axios.$post('/cards', this.card)
        }
        this.$router.push('/')
      } catch (error) {
        alert(error)
      }
    },
    onCancel(evt) {
      evt.preventDefault()
      this.$router.push('/')
    },
    detailValidator(tag) {
      return tag.length <= 10
    },
  },
}
</script>

<style></style>

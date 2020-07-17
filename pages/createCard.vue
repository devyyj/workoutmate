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
          v-model="workout.nick_name"
          disabled
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-1" label="함께할 운동" label-for="input-1">
        <b-form-select
          id="input-1"
          v-model="workout.type"
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
          v-model="workout.detail"
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
          v-model="workout.date"
          class="mb-2"
        ></b-form-datepicker>
        <b-form-timepicker
          id="example-timepicker"
          v-model="workout.time"
          locale="kr"
          class="mb-2"
        ></b-form-timepicker>
        <b-form-input
          id="input-3"
          v-model="workout.location"
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
              v-model="workout.member"
              type="number"
              pattern="\d*"
              :state="memberState"
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
              v-model="workout.cost"
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
          v-model="workout.content"
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
export default {
  data() {
    return {
      workout: {
        user_id: '',
        nick_name: '',
        content: '',
        date: m().format('YYYY-MM-DD'),
        time: m().format('HH:mm:ss'),
        location: '',
        cost: 0,
        member: 1,
        detail: [],
        type: null,
      },
      wait: false,
      options: [
        { value: null, text: '운동을 선택해 주세요.' },
        { value: '헬스', text: '헬스' },
        { value: '러닝', text: '러닝' },
        { value: '워킹', text: '워킹' },
        { value: '축구', text: '축구' },
        { value: '등산', text: '등산' },
        { value: '기타', text: '기타' },
      ],
    }
  },
  computed: {
    // state()로 유효성 체크
    detailState() {
      const length = this.workout.detail.length
      return length === 0 ? null : length <= 10
    },
    typeState() {
      return this.workout.type !== null
    },
    locationState() {
      return this.workout.location.length > 0
    },
    memberState() {
      return this.workout.member > 0 && this.workout.member < 100
    },
    costState() {
      return (
        this.workout.cost >= 0 &&
        this.workout.cost <= 1000000 &&
        this.workout.cost.length !== 0
      )
    },
    contentState() {
      return (
        this.workout.content.length !== 0 && this.workout.content.length <= 250
      )
    },
  },
  async mounted() {
    if (this.$route.query.id) {
      // 카드 수정
      const workout = await this.$axios.$get(
        `/cards?id=${this.$route.query.id}`
      )
      this.workout.user_id = workout.user_id
      this.workout.nick_name = workout.user.nick_name
      this.workout.content = workout.content
      this.workout.date = m(workout.workout_time).format('YYYY-MM-DD')
      this.workout.time = m(workout.workout_time).format('HH:mm:ss')
      this.workout.location = workout.workout_location
      this.workout.cost = workout.workout_cost
      this.workout.member = workout.workout_member
      this.workout.detail = workout.workout_detail.split(',')
      this.workout.type = workout.workout_type
    } else {
      // 카드 생성
      const myid = await this.$axios.$get('/myid')
      this.workout.user_id = myid
      const data = await this.$axios.$get(`/users?id=${myid}`)
      this.workout.nick_name = data.nick_name
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
            this.memberState &&
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
          this.workout.id = this.$route.query.id
          await this.$axios.$patch('/cards', this.workout)
        } else {
          await this.$axios.$post('/cards', this.workout)
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

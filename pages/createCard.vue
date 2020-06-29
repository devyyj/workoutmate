<template>
  <div>
    <b-form v-if="show" @submit="onSubmit" @reset="onReset">
      <b-form-group
        id="input-group-1"
        label="함께할 운동"
        label-for="input-1"
        description="헬스, 섹스, 러닝, 걷기, 축구, 야구 등"
      >
        <b-form-input
          id="input-1"
          v-model="workout.type"
          required
          placeholder="운동을 입력해라 새꺄"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-2"
        label="운동 스타일"
        label-for="tags-pills"
      >
        <b-form-tags
          v-model="workout.detail"
          input-id="tags-pills"
          tag-variant="primary"
          tag-pills
          separator=" "
          placeholder="#빡세게 #쉬면서 #초보 #헬창 #재밌게"
          class="mb-2"
          remove-on-delete
        ></b-form-tags>
      </b-form-group>

      <b-form-group label="운동 날짜" label-for="example-datepicker">
        <b-form-datepicker
          id="example-datepicker"
          v-model="workout.date"
          class="mb-2"
        ></b-form-datepicker>
      </b-form-group>

      <b-form-group label="운동 시간" label-for="example-timepicker">
        <b-form-timepicker
          id="example-timepicker"
          v-model="workout.time"
          locale="kr"
        ></b-form-timepicker>
      </b-form-group>

      <b-form-group id="input-group-3" label="운동 장소" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="workout.location"
          required
          placeholder="위치가 어디니"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="모집 인원" label-for="input-4">
        <b-form-input
          id="input-4"
          v-model="workout.member"
          required
          placeholder="숫자만 가능스"
          type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-5" label="비용" label-for="input-5">
        <b-form-input
          id="input-5"
          v-model="workout.cost"
          required
          placeholder="원"
          type="number"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-6"
        label="하고 싶은 말"
        label-for="textarea-no-resize"
      >
        <b-form-textarea
          id="textarea-no-resize"
          v-model="workout.content"
          placeholder="본문을 쓰거라"
          rows="3"
          no-resize
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      workout: {
        content: '',
        date: '2020-06-29',
        time: '12:34:56',
        location: '',
        cost: 0,
        member: 1,
        detail: '',
        type: '',
      },
      show: true,
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      alert(JSON.stringify(this.workout))
    },
    onReset(evt) {
      evt.preventDefault()
      // Reset our form values
      this.workout.content = ''
      this.workout.date = ''
      this.workout.time = ''
      this.workout.location = ''
      this.workout.cost = ''
      this.workout.member = ''
      this.workout.detail = ''
      this.workout.type = ''
      // Trick to reset/clear native browser form validation state
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}
</script>

<style></style>

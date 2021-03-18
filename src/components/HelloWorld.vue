<template>
  <h1>{{ msg }}</h1>
  <h2>
    Message: <span>{{ status.message }}</span>
  </h2>

  <div v-for="endpoint in endpoints" :key="endpoint.code">
    <button @click="visitEndpoint(endpoint.url)">{{ endpoint.title }}</button>
  </div>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import { HTTP, SERVICE_STATE } from "../useHttp.js";

defineProps({
  msg: String,
});

const status = reactive({
  state: "idle",
  message: "You haven't made a request yet.",
});

const endpoints = [
  {
    code: 200,
    title: "Success",
    url: "/success",
  },
  {
    code: 403,
    title: "Not Authorized",
    url: "/not-authorized",
  },
  {
    code: 404,
    title: "Not Found",
    url: "/not-found",
  },
  {
    code: 500,
    title: "Server Error",
    url: "/server-error",
  },
];

const visitEndpoint = async (path) => {
  try {
    const { state, data } = await HTTP.get(path);

    switch (state) {
      case SERVICE_STATE.SUCCESS:
        status.state = "success";
        status.message = data.message;
        break;
      case SERVICE_STATE.NOT_AUTHORIZED:
        status.state = "error";
        status.message = "You are not authorized to view this page.";
        break;
      case SERVICE_STATE.NOT_FOUND:
        status.state = "error";
        status.message = "This page was not found.";
        break;
      case SERVICE_STATE.SERVER_ERROR:
        status.state = "error";
        status.message = "Sorry! It seems there was a server error.";
        break;
      default:
        status.state = "error";
        status.message =
          "We have encountered an error. If the issue persists, please contact our support team.";
        break;
    }
  } catch (error) {
    console.log("error", error);
  }
};
</script>

<style scoped>
button {
  color: #42b983;
  margin-bottom: 10px;
}

span {
  color: blue;
}
</style>

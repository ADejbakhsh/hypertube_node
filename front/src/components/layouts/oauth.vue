<template>
  <div>
    <v-btn @click="connectFortytwo" color="success" class="mr-4" >42connect</v-btn>
    <v-btn  :disabled="true" color="success" class="mr-4" @click="connectGoogle">GoogleConnect</v-btn>
  </div>
</template>

<script>
import axios, {baseURL} from "@/config/axios_default";

export default {
  name: "oauth",
  methods: {
    connectFortytwo() {
   	 window.location= baseURL + "/😱/oauth42"
    },
    connectGoogle() {
    	window.location= baseURL + "/😱/oauthGoogle"
    }
  }
};
</script>

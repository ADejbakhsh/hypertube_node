<template>
  <v-card class="mx-auto overflow-hidden" tile>
    <v-app-bar color="deep-purple accent-4" dense dark>
      <v-app-bar-nav-icon class="d-sm-none" @click.stop="showMenu = !showMenu"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <h3>
          <router-link to="/" v-slot="{ href, route, navigate}">
            <a :href="href" @click="navigate">Hypertube</a>
          </router-link>
        </h3>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <language />
      <v-btn-toggle class="d-none d-sm-flex" v-if="!isConnected" shaped borderless>
        <sign-up />
        <sign-in />
      </v-btn-toggle>

      <v-menu v-else light bottom left nudge-bottom="35" v-model="showMenuUser">
        <template v-slot:activator="{ on }">
          <v-btn icon class="d-none d-sm-flex" v-on="on">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>

        <v-list data-app="true">
          <v-list-item>
            <v-list-item-title @click="logout()">{{ $t('signout') }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <router-link
              :to="{ name: 'userProfile', params: { userId: $store.state.user.id }}"
              v-slot="{ href, route, navigate}"
            >
              <v-list-item-title>
                <a
                  :href="href"
                  style="text-decoration: none; color: unset"
                  @click="navigate"
                >{{ $t('userprofile') }}</a>
              </v-list-item-title>
            </router-link>
          </v-list-item>
          <v-list-item>
            <modify-profil />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer
      class="deep-purple accent-4"
      dark
      fixed
      temporary
      v-model="showMenu"
      width="100%"
    >
      <v-app-bar-nav-icon  @click.stop="showMenu = !showMenu"></v-app-bar-nav-icon>
      <v-list>
        <ul v-if="false">
          <v-list-item v-for="item in items" :key="item.title" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </ul>
      </v-list>
      <template>
        <div v-if="isConnected == true" class="pa-2">
          <v-list-item>
            <router-link
              :to="{ name: 'userProfile', params: { userId: $store.state.user.id }}"
              v-slot="{ href, route, navigate}"
            >
              <v-list-item-title>
                <a
                  :href="href"
                  style="text-decoration: none; color: unset"
                  @click="navigate"
                >{{ $t('userprofile') }}</a>
              </v-list-item-title>
            </router-link>
          </v-list-item>
            <modify-profil/>
          <v-btn block @click.stop="logout">{{$t('signout')}}</v-btn>
        </div>
        <div v-else>
        
    
          <v-list-item>
              <v-list-item-title> 
            <sign-up />
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title> 
            <sign-in />
            </v-list-item-title> 
          </v-list-item>
       
       
        </div>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>


<script>
import signup from "./modal_signup";
import signin from "./modal_signin";
import profil from "./modal_profil";
import axios from "@/config/axios_default";
import language from "./LangButton";

export default {
  data() {
    return {
      showMenu: false,
      showMenuUser: false
    };
  },
  methods: {
    async logout() {
      const response = await axios
        .delete("/😂/authentication")
        .then(response => {
          return true;
        });
      this.$store.commit("disconnectUser");
    }
  },
  computed: {
    isConnected() {
      return this.$store.getters.connected;
    }
  },
  components: {
    "sign-up": signup,
    "sign-in": signin,
    language,
    "modify-profil": profil
  }
};
</script>

<style lang="scss" media="screen">
h3 a {
  text-decoration: none;
  color: #00ffdf !important;
}
.v-menu__content {
  left: 0;
  max-width: 100%;
}
</style>

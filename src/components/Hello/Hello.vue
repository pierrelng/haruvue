<template>
  <div class="containerCenter">
    <div class="wrapper">
      <div class="logo"></div>
      <p class="intro col lineHeight">
        <span class="bold">Suite au récent scandale, Facebook a fermé l’accès aux données des events. Nous, comme
          beaucoup d’autres médias, en dépendions afin de sourcer et de réaliser notre selection.</span>
      </p>
      <p class="intro col lineHeight last">
        <span class="bold">On bosse dur pour trouver une solution et on vous tient au courant dès qu’on y arrive.</span>
      </p>
      <form class="helloForm col" action="#" @submit.prevent>
        <input class="inputText" type="text" placeholder="Ton prénom" v-model="firstName" ref="inputFirstname"/>
        <input class="inputText" type="text" placeholder="Ton tel" v-model="telephone" ref="inputTel"/>
        <mt-spinner v-show="showSpinner" type="fading-circle" :size="24" color="#EEEEEE"></mt-spinner>
        <span v-show="error" class="bold red">Erreur, veuillez rafraichir la page et réessayez.</span>
        <input class="submit" :class="{ green: toggleGreen }" type="submit" @click="send()" :value="submit">
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'hello',
  data() {
    return {
      firstName: '',
      telephone: '',
      submit: 'gogogo',
      toggleGreen: false,
      showSpinner: false,
      error: false,
    };
  },
  methods: {
    send() {
      if (this.submit === 'gogogo') {
        if (!this.firstName) {
          this.$refs.inputFirstname.focus();
        } else if (!this.telephone) {
          this.$refs.inputTel.focus();
        } else {
          this.showSpinner = true;
          axios.post('https://hosting.haruapp.fr/wp-json/haru/v1/subscribe', {
            firstname: this.firstName,
            telephone: this.telephone,
          })
            .then((rsp) => {
              console.log(rsp);
              this.showSpinner = false;
              this.submit = 'Merci !';
              this.toggleGreen = true;
            })
            .catch((error) => {
              this.error = true;
              console.log(error);
              this.showSpinner = false;
            });
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" src="./Hello.styl"></style>

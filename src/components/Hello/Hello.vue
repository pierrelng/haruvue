<template>
  <div class="wrapper">
    <div class="logo"></div>
    <p class="col lineHeight"><span class="bold">Hello copain, hello copine !</span></p>
    <p class="intro col lineHeight">Bienvenue sur la beta. Nous sommes actuellement en version <span class="bold blue">0.1.0</span>, et voici ce qu'on peut faire pour le moment :</p>
    <ul class="col lineHeight">
      <li>Découvrir les évènements à venir dans le flux infini ou en choisissant une date prochaine</li>
      <li>Écouter un aperçu sonore des events</li>
      <li>Retrouver toutes les informations utiles d’un event  : map, billetterie, description, tags, réseaux sociaux...</li>
      <li>Découvrir des informations sur le lieu d’un event</li>
    </ul>
    <a href="/#/home">Let's go !</a>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: '',
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" src="./Hello.styl"></style>

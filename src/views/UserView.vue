<template>
    <div>
        <NavbarLayout></NavbarLayout>
        <RouterView></RouterView>
    </div>
</template>

<script>
import NavbarLayout from '../components/NavbarLayout.vue';

export default {
  data() {
    return { };
  },
  components: {
    NavbarLayout,
  },
};
</script>

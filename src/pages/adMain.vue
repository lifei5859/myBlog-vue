<template>
  <main class="container_wrapper">
    <Row class="container">
      <Col :xs="24" :md="24" :sm="24" :lg="16">
        <router-view/>
      </Col>
      <Col :xs="24" :md="24" :sm="24" :lg="8">
        <RightModule />
      </Col>

    </Row>
  </main>
</template>

<script>
import Left from '../components/left'
import RightModule from '../components/rightModule'
import { Row, Col } from 'iview'
export default {
  name: 'adMain',
  components: {
    RightModule,
    Row,
    Col,
    Left
  }
}
</script>

<style>
  @import "../css/index.css";
  @media (max-width: 600px) {
    .container_wrapper {
      padding: 0;
    }
  }
</style>

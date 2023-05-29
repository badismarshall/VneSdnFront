<script setup>
import axios from 'axios';
import { ref } from 'vue';
const username = ref('');
const password = ref('');
import { useRouter } from 'vue-router';
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();
import { Notyf } from 'notyf';

store.state.sidebar = false;
function loginfun() { 
    axios.post('http://localhost:8000/api/login/', {
        username: username.value,
        password: password.value
    })
        .then(function (response) {
        console.log(response);
        console.log(response.data['status']);
        if (response.data['status'] == "success") {
            store.state.sidebar = true;
            router.push({ path: '/home' });
        }
        else {
            const notyf = new Notyf({
          duration: 1000,
          position: {
            x: 'center',
            y: 'bottom',
          },
          types: [
            {
              type: 'warning',
              background: 'red',
              icon: {
                className: 'material-icons',
                tagName: 'i',
                text: 'warning'
              }
            },
            {
              type: 'error',
              background: 'indianred',
              duration: 2000,
              dismissible: true
            }
          ]
        });
        notyf.open({
          type: 'error',
          message: 'Invalid Credentials',
          duration: 2000,
          dismissible: false
        });
        }
    })
        .catch(function (error) {
        console.log(error);
    });
}
</script>
<template >
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/css/all.min.css"/>

<div class="bd">
<div class="cont">
      <form action="" method="" @submit.prevent="loginfun">
        <div class="title">Login</div>
        <div class="input-box underline">
          <input type="text" placeholder="Enter Your Username" required v-model="username">
          <div class="underline"></div>
        </div>
        <div class="input-box">
          <input type="password" placeholder="Enter Your Password" required v-model="password">
          <div class="underline"></div>
        </div>
        <div class="input-box button">
          <input type="submit" name="" value="Continue">
         
        </div>
      </form>
        <!-- 
            <div class="option">Or Connect With Social Media</div> 
        -->
                                                                           
        <!-- 
        <div class="twitter">
          <a href="#"><i class="fab fa-twitter"></i> Sign in With Twitter</a>
        </div>
        --- 
        <div class="facebook">
          <a href="#"><i class="fab fa-facebook-f"></i> Sign in With Facebook</a>
        </div> 
        -->
    </div>
</div>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap');
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.bd{
  display: grid;
  height: 100vh;
  width: 100%;
  place-items: center;
  background: linear-gradient(to right, #695CFE 0%, #ff0080 100%);
}

::selection{
  background: #ff80bf;
}

.cont{

  background: #fff;
  max-width: 350px;
  width: 100%;
  padding: 25px 30px;
  border-radius: 5px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.15);
}
.cont form .title{
  font-size: 30px;
  font-weight: 600;
  margin: 20px 0 10px 0;
  position: relative;
}
.cont form .title:before{
  content: '';
  position: absolute;
  height: 4px;
  width: 33px;
  left: 0px;
  bottom: 3px;
  border-radius: 5px;
  background: linear-gradient(to right, #695CFE 0%, #ff0080 100%);
}
.cont form .input-box{
  width: 100%;
  height: 45px;
  margin-top: 25px;
  position: relative;
}
.cont form .input-box input{
  width: 100%;
  height: 100%;
  outline: none;
  font-size: 16px;
  border: none;
}
.cont form .underline::before{
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  background: #ccc;
  left: 0;
  bottom: 0;
}
.cont form .underline::after{
  content: '';
  position: absolute;
  height: 2px;
  width: 100%;
  background: linear-gradient(to right, #695CFE 0%, #ff0080 100%);
  left: 0;
  bottom: 0;
  transform: scaleX(0);
  transform-origin: left;
  transition: all 0.3s ease;
}
.cont form .input-box input:focus ~ .underline::after,
.cont form .input-box input:valid ~ .underline::after{
  transform: scaleX(1);
  transform-origin: left;
}
.cont form .button{
  margin: 40px 0 20px 0;
}
.cont .input-box input[type="submit"]{
  background: linear-gradient(to right, #695CFE 0%, #ff0080 100%);
  font-size: 17px;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cont .input-box input[type="submit"]:hover{
  letter-spacing: 1px;
  background: linear-gradient(to left, #695CFE 0%, #ff0080 100%);
}
.cont .option{
  font-size: 14px;
  text-align: center;
}
.cont .facebook a,
.cont .twitter a{
  display: block;
  height: 45px;
  width: 100%;
  font-size: 15px;
  text-decoration: none;
  padding-left: 20px;
  line-height: 45px;
  color: #fff;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.cont .facebook i,
.cont .twitter i{
  padding-right: 12px;
  font-size: 20px;
}
.cont .twitter a{
  background: linear-gradient(to right,  #00acee 0%, #1abeff 100%);
  margin: 20px 0 15px 0;
}
.cont .twitter a:hover{
  background: linear-gradient(to left,  #00acee 0%, #1abeff 100%);
  margin: 20px 0 15px 0;
}
.cont .facebook a{
  background: linear-gradient( to right,  #3b5998 0%, #476bb8 100%);
  margin: 20px 0 50px 0;
}
.cont .facebook a:hover{
  background: linear-gradient( to left,  #3b5998 0%, #476bb8 100%);
  margin: 20px 0 50px 0;
}
</style>

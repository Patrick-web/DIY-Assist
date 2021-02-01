import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard";
import LandingPage from "@/views/LandingPage";
import Chat from "@/components/Chat/Chat";
import Create from "@/components/Chat/Create";
import ChatList from "@/components/Chat/ChatList";
import Profile from "@/components/User/Profile";
import Signup from "@/components/User/Signup";
import Signin from "@/components/User/Signin";
import AuthGuard from "./auth-guard";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "LandingPage",
      component: LandingPage,
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Dashboard,
    },
    {
      path: "/login",
      name: "Signin",
      component: Signin,
    },
    {
      path: "/register",
      name: "Signup",
      component: Signup,
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
    },
    {
      path: "/chat/:id",
      name: "Chat",
      component: Chat,
      props: true,
      beforeEnter: AuthGuard,
    },
    {
      path: "/create",
      name: "CreateChat",
      component: Create,
      beforeEnter: AuthGuard,
    },
    {
      path: "/discover",
      name: "JoinChat",
      component: ChatList,
      beforeEnter: AuthGuard,
    },
  ],
  mode: "history",
});

import React from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Hero from "./components/Hero";
// import Ecommerce from "./components/ecommerce";
import Footer from "./components/Footer";

function App() {
  return (
    <>  
    <Loader />
      <Header />
      <Hero />

    {/* <Ecommerce /> */}
      <Footer /> 
    </>
  );
}

export default App;

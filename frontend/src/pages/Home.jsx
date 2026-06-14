import React from 'react'
import Hero from "../components/Hero.jsx" ;
import Features from "../components/Features.jsx" ;
import Categories from "../components/Categories.jsx";
import Offer from "../components/Offer.jsx" ;
import Footer from "../components/Footer.jsx" ;
import MockupSection from "../components/MockupSection.jsx";

const Home = () => {
  return (
    <div>
      <section id="home">
         <Hero/>
      </section>

     <section id="features">
         <Features/>
            </section>


      <section id="categories">
            <Categories/>
                </section>
                
      <section id="mockups">
            <MockupSection/>
      </section>

          <section id="shop">
            <Offer/>
               </section>

      <section id="contact">
            <Footer/>
     </section>



    </div>
  )
}

export default Home ;
import React from 'react'
import Hero from "../components/Hero.jsx" ;
import Features from "../components/Features.jsx" ;
import Categories from "../components/Categories.jsx";
import Footer from "../components/Footer.jsx" ;
import MockupSection from "../components/MockupSection.jsx";
import Contact from '../components/Contact.jsx';

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

        

       <section>
        <Contact/>
        </section>        

      <section id="contact">
            <Footer/>
     </section>



    </div>
  )
}

export default Home ;
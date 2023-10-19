import React from "react";

import logo from "../assets/flowise_logo.png";
import sampleAppImage from "../assets/webimg.png";
import temp from "../assets/templates.png";
import "./App.css"; // Import your CSS file
import home from "../assets/VF1.gif";
import transform from "../assets/transform.png";
import extract from "../assets/extract.png";
import load from "../assets/load.png";
import build from "../assets/Vfb.png";
import about from "../assets/au.png";
import sync from "../assets/sync.png";
import drag from "../assets/drag.png";
import pipe from "../assets/pipe.png";
import scale from "../assets/scale.png";
import emb from "../assets/embeddings.png";
import LC from "../assets/LC.png";
import chat from "../assets/chat.png";
const Hero = () => (
<div class="software-company-website">
<div class="hero-wrapper">
  <div class="hero-wrapper-text">
    <div class="header-text">
      <div class="h-1-primary-text">
        <span
          ><span class="h-1-primary-text-span"></span
          ><span class="h-1-primary-text-span2">Low Code</span
          ><span class="h-1-primary-text-span3"> ETL</span
          ><span class="h-1-primary-text-span4"> <br /></span
          ><span class="h-1-primary-text-span5">for Unstructured Data</span
          ><span class="h-1-primary-text-span4"> <br /></span
          ><span class="h-1-primary-text-span6">& GenAI Platform</span></span
        >
      </div>
    </div>
    <div class="btn-primary">
      <div class="let-s-get-started">Let’s get started!</div>
    </div>
    <div className="additional-text">
  A SaaS based low code ETL pipeline for creating high-quality vector embedding{<br />}{<br/>}{<br/>} of unstructured data to build Generative AI applications.
</div>



  </div>
  <div class="hero-wrapper-image">
    <div class="hero-wrapper-image-center">
      <img class="web-development-1" src={home} />
    </div>
  </div>
</div>

  <div class="about-us-details">
    <div class="about-us-details-wrapper">
      <div class="deco-line"></div>
      <div class="about-us-details-text">
        <div
          class="we-add-development-capacity-to-tech-teams-our-value-isn-t-limited-to-building-teams-but-is-equally-distributed-across-the-project-lifecycle-we-are-a-custom-software-development-company-that-guarantees-the-successful-delivery-of-your-project"
        >
          <span
            ><span
              class="we-add-development-capacity-to-tech-teams-our-value-isn-t-limited-to-building-teams-but-is-equally-distributed-across-the-project-lifecycle-we-are-a-custom-software-development-company-that-guarantees-the-successful-delivery-of-your-project-span"
              >We </span
            ><span
              class="we-add-development-capacity-to-tech-teams-our-value-isn-t-limited-to-building-teams-but-is-equally-distributed-across-the-project-lifecycle-we-are-a-custom-software-development-company-that-guarantees-the-successful-delivery-of-your-project-span2"
              >at VectrFlow</span
            ><span
              class="we-add-development-capacity-to-tech-teams-our-value-isn-t-limited-to-building-teams-but-is-equally-distributed-across-the-project-lifecycle-we-are-a-custom-software-development-company-that-guarantees-the-successful-delivery-of-your-project-span3"
            >
              </span
            >, we specialize in harnessing the power of cutting-edge AI technologies, particularly Language Models (LLMs), to seamlessly convert unstructured data from a multitude of formats and sources into highly organized and structured information. With a deep commitment to innovation, we're on a mission to revolutionize the way businesses and individuals transform raw, diverse data into actionable insights.</span
          >
        </div>
      </div>
    </div>
    <div class="link-click">
      <a href="https://vectrflow.com " class="see-more-informations">See more Informations</a>
      <div class="arrow-right-line">
        <svg
          class="group"
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.172 11.4999L10.808 6.13592L12.222 4.72192L20 12.4999L12.222 20.2779L10.808 18.8639L16.172 13.4999H4V11.4999H16.172Z"
            fill="#57007B"
          />
        </svg>
      </div>
    </div>
  </div>
  {/* <div class="abou-us-video"> */}
    <div class="video-wrappper">
      <img class="rectangle-8" src={about} />
    </div>
    
    
  {/* </div> */}
  <div class="ellipse-180"></div>
  <div class="ellipse-181"></div>
  
  {/* <div class="group-15">
    <div class="our-service-wrapper"> */}
      <div class="rectangle-5"></div>
      <div class="group-8">
        <div class="services-we-offer">The Pipeline: Extract, Transform and Load</div>
        <div class="slider-nodes"></div>
      </div>
      <div class="carousel-nodes">
        
        <div class="ellipse-3"></div>
        <div class="ellipse-1"></div>
        <div class="ellipse-4"></div>
        
      </div>
      <div class="card-carousel">
        <div class="service-card">
          <div class="card-wrapper">
            <div class="rectangle-4"></div>
          </div>
          <div class="frame-10">
            <div class="frame-9">
              <div class="group-1">
                <div class="ellipse-12"></div>
              </div>
              <div class="web-design-development">Extract</div>
            </div>
            <div
              class="a-website-is-an-extension-of-yourself-and-we-can-help-you-to-express-it-properly-your-website-is-your-number-one-marketing-asset-because-we-live-in-a-digital-age"
            >
              Load, scrape, parse, and convert data from diverse sources into a unified format.

            </div>
          </div>
        </div>
        <div class="service-card2">
          <div class="card-wrapper">
            <div class="rectangle-4"></div>
          </div>
          <div class="frame-10">
            <div class="frame-9">
              <div class="group-12">
                <div class="ellipse-12"></div>
              </div>
              
              <div class="web-design-development">Load</div>
            </div>
            <div
              class="a-website-is-an-extension-of-yourself-and-we-can-help-you-to-express-it-properly-your-website-is-your-number-one-marketing-asset-because-we-live-in-a-digital-age"
            >
              Store, index, and Quantize in Vector database to serve the vector embeddings to LLM applications.

            </div>
          </div>
        </div>
        <div class="service-card3">
          <div class="card-wrapper">
            <div class="rectangle-42"></div>
          </div>
          <div class="frame-102">
            <div class="frame-92">
              <div class="group-12">
                <div class="ellipse-12"></div>
                <img
                  class="code-perspective-matte"
                  src={transform}
                />
              </div>
              <div class="web-design-development2">
                Transform<br />
              </div>
            </div>
            <div
              class="a-website-is-an-extension-of-yourself-and-we-can-help-you-to-express-it-properly-your-website-is-your-number-one-marketing-asset-because-we-live-in-a-digital-age2"
            >
              Preprocess, manipulate, and enhance data quality using deep learning models., GPT, Langchain, LlamaIndex to create vector embeddings

            </div>
          </div>
        </div>
      </div>
      
      <img
        class="mobile-app-perspective-matte"
        src={extract}
      /><img
        class="dashboard-perspective-matte"
        src={load}
      />
      <div class="line-1"></div>
      <div class="line-2"></div>
    {/* </div>
  </div> */}
  
  <div class="heading-h-2-left4">
    <h2>Features of VectrFlow</h2>
    
    
  </div>
  {/* <div class="group-20">
    <div class="ellipse-177"></div>
    <div class="ellipse-185"></div>
    <div class="ellipse-186"></div>
    <div class="ellipse-187"></div>
    <div class="ellipse-188"></div>
    <div class="ellipse-189"></div>
  </div> */}
  <div class="frame-54">
    <div class="frame-53">
      <div class="way-building-details">
        <div class="frame-47">
          <div class="build-the-right-team-to-scale">
            Build
          </div>
          <div class="frame-48">
            <div
              class="finding-the-right-talent-is-not-easy-we-help-you-find-the-talent-that-suits-your-needs-follows-your-processes-and-sticks-with-you-long-term-not-the-case-with-freelancers"
            >
              Automate processes by drag and dropping AI models, data loaders, and plugins.
            </div>
            <div class="frame-49">
              <div
                class="our-delivery-model-helps-you-cut-costs-and-deliver-within-budget"
              >
                </div>
            </div>
          </div>
        </div>
        
      </div>
      <div class="frame-46"></div>
      <img class="rectangle-17" src={build} />
    </div>
    <div class="frame-52">
      <img class="rectangle-18" src={build}/>
      <div class="way-building-details">
        <div class="frame-47">
          <div class="build-the-right-team-to-scale">
          Use your Data
          </div>
          <div class="frame-48">
            <div
              class="finding-the-right-talent-is-not-easy-we-help-you-find-the-talent-that-suits-your-needs-follows-your-processes-and-sticks-with-you-long-term-not-the-case-with-freelancers"
            >
              Feed your AI with documents, databases, and over 30 integrations to customize your AI application with your data.
            </div>
            <div class="frame-49">
              <div
                class="our-delivery-model-helps-you-cut-costs-and-deliver-within-budget"
              >
               
              </div>
             
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <div class="frame-51">
      <div class="way-building-details">
        <div class="frame-47">
          <div class="build-the-right-team-to-scale">
          Deploy
          </div>
          <div class="frame-48">
            <div
              class="finding-the-right-talent-is-not-easy-we-help-you-find-the-talent-that-suits-your-needs-follows-your-processes-and-sticks-with-you-long-term-not-the-case-with-freelancers"
            >
              Export a chatbot, an internal interface, or generate an API endpoint automatically to seamlessly run your application in a production environment.
            </div>
            <div class="frame-49">
              <div
                class="our-delivery-model-helps-you-cut-costs-and-deliver-within-budget"
              >
                
              </div>
              
            </div>
          </div>
        </div>
        {/* <div class="person-badge">
          <img class="ellipse-1852" src="ellipse-1852.png" />
          <div class="frame-50">
            <div class="jeewa-markram">Jeewa markram</div>
            <div class="ceo">CEO</div>
          </div>
        </div> */}
      </div>
      <img class="rectangle-19" src={chat} />
    </div>
  </div>

  <div class="card-sm">
    <div class="rectangle-21"></div>
    <div class="frame-57">
      <div class="group-34">
        <div class="rectangle-27"></div>
      </div>
      <div class="frame-56">
        <div class="card-main-title">Low code drag and drop functionality
</div>
        <div
          class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code"
        >
          <span
            ><span
              class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code-span"
              >
              Low code drag and drop functionality is a user-friendly development approach that simplifies application creation. It employs a visual interface where users can easily design and build elements by dragging and dropping components onto a canvas. This approach reduces the need for extensive coding, making it accessible to non-developers.</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
  {/* <h2>Features of Vectrflow</h2> */}
  <div class="card-sm2">
    <div class="rectangle-21"></div>
    <div class="frame-57">
      <div class="group-34">
        <div class="rectangle-272"></div>
      </div>
      <div class="frame-56">
        <div class="card-main-title">Automated Data Ingestion Pipeline 
</div>
        <div
          class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code"
        >
          <span
            ><span
              class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code-span4"
              >An Automated Data Ingestion Pipeline is a structured data workflow that efficiently collects, transforms, and loads data from various sources into a central repository or data warehouse. This pipeline automates the often complex and time-consuming process of data acquisition, ensuring data quality and consistency.  </span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="card-sm3">
    <div class="rectangle-21"></div>
    <div class="frame-57">
      <div class="group-34">
        <div class="rectangle-273"></div>
      </div>
      <div class="frame-56">
        <div class="card-main-title">
        Vectorstore and computed Embeddings 

        </div>
        <div
          class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code"
        >
          <span
            ><span
              class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code-span7"
              >"Vectorstore" refers to a repository or database that stores vector representations of data points or entities. Computed embeddings, in this context, are vectors generated through techniques like word embeddings (e.g., Word2Vec or GloVe) or deep learning models </span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="card-sm4">
    <div class="rectangle-21"></div>
    <div class="frame-57">
      <div class="group-34">
        <div class="rectangle-274"></div>
      </div>
      <div class="frame-56">
        <div class="card-main-title">Scalable data Pipeline
</div>
        <div
          class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code"
        >
          <span
            ><span
              class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code-span10"
              >
              A scalable data pipeline is a sophisticated architecture that can efficiently process, transform, and transmit large volumes of data. It's designed to adapt to growing data needs, ensuring seamless performance and accommodating increasing data volumes, making it ideal for organizations with dynamic data requirements.</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="card-sm5">
    <div class="rectangle-21"></div>
    <div class="frame-57">
      <div class="group-34">
        <div class="rectangle-275"></div>
      </div>
      <div class="frame-56">
        <div class="card-main-title">Streamline Langchain and LlamaIndex development
</div>
        <div
          class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code"
        >
          <span
            ><span
              class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code-span13"
              >
              To streamline Langchain and LlamaIndex development, prioritize clear project roadmaps and agile methodologies, enhance cross-team collaboration and communication, and leverage modular, reusable code components for efficient coding and testing, ultimately accelerating the development process and improving product quality.</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
  <div class="card-sm6">
    <div class="rectangle-21"></div>
    <div class="frame-57">
      <div class="group-34">
        <div class="rectangle-276"></div>
      </div>
      <div class="frame-56">
        <div class="card-main-title">Periodic data Sync and pay as you use
</div>
        <div
          class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code"
        >
          <span
            ><span
              class="unlike-other-companies-we-are-a-ux-first-development-company-projects-are-driven-by-designers-and-they-make-sure-design-and-experiences-translate-to-code-span16"
              >Periodic data sync refers to the scheduled and automatic updating of information between systems or databases at regular intervals, ensuring data consistency and accuracy. "Pay as you use" implies a pricing model where customers are billed based on the actual resources or services they consume, promoting cost efficiency and scalability.</span
            ></span
          >
        </div>
      </div>
    </div>
  </div>
  <img
    class="heart-rate-perspective-matte"
    src={sync}
  />
  <div class="code-perspective-matte2"></div>
  <img class="code-perspective-matte3" src={pipe} /><img
    class="shield-perspective-matte"
    src={emb}
  /><img
    class="padlock-perspective-matte"
    src={scale}
  /><img
    class="success-perspective-matte"
    src={LC}
  /><img class="rocket-perspective-matte" src={drag} />
  
  
  <div class="footer-section">
    <div class="rectangle-34"></div>
    <div class="group-78">
      <div class="group-72">
        <div class="group-71">
          <div
            class="lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry"
          >
            VectrFlow is Simply a Low Code ETL Platform for LLM and GenAI Platform
          </div>
          
          <div class="group-122">
            <div class="group-5">
              <div class="ellipse-16"></div>
              <svg
                class="facebook-1"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_102_328)">
                  <path
                    d="M7.9985 1.9925H9.094V0.0845C8.905 0.0585 8.255 0 7.498 0C5.91851 0 4.83651 0.9935 4.83651 2.8195V4.5H3.09351V6.633H4.83651V12H6.97351V6.6335H8.646L8.9115 4.5005H6.97301V3.031C6.97351 2.4145 7.1395 1.9925 7.9985 1.9925Z"
                    fill="#1A202C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_102_328">
                    <rect width="12" height="12" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="group-11">
              <div class="group-6">
                <div class="ellipse-17"></div>
              </div>
              <svg
                class="instagram-1"
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_102_333)">
                  <path
                    d="M9.481 0H3.51898C1.57858 0 0 1.57858 0 3.51898V9.4811C0 11.4214 1.57858 13 3.51898 13H9.4811C11.4214 13 13 11.4214 13 9.4811V3.51898C13 1.57858 11.4214 0 9.481 0V0ZM12.2379 9.4811C12.2379 11.0012 11.0012 12.2379 9.481 12.2379H3.51898C1.99881 12.2379 0.762114 11.0012 0.762114 9.4811V3.51898C0.762114 1.99881 1.99881 0.762114 3.51898 0.762114H9.4811C11.0012 0.762114 12.2379 1.99881 12.2379 3.51898V9.4811Z"
                    fill="#1A202C"
                  />
                  <path
                    d="M6.50002 2.94531C4.53998 2.94531 2.94543 4.53986 2.94543 6.49989C2.94543 8.45993 4.53998 10.0545 6.50002 10.0545C8.46005 10.0545 10.0546 8.45993 10.0546 6.49989C10.0546 4.53986 8.46005 2.94531 6.50002 2.94531ZM6.50002 9.29236C4.96032 9.29236 3.70755 8.03969 3.70755 6.49989C3.70755 4.96019 4.96032 3.70743 6.50002 3.70743C8.03982 3.70743 9.29248 4.96019 9.29248 6.49989C9.29248 8.03969 8.03982 9.29236 6.50002 9.29236Z"
                    fill="#1A202C"
                  />
                  <path
                    d="M10.1396 1.68311C9.56035 1.68311 9.08923 2.15432 9.08923 2.73344C9.08923 3.31266 9.56035 3.78388 10.1396 3.78388C10.7188 3.78388 11.19 3.31266 11.19 2.73344C11.19 2.15422 10.7188 1.68311 10.1396 1.68311ZM10.1396 3.02166C9.98068 3.02166 9.85135 2.89233 9.85135 2.73344C9.85135 2.57445 9.98068 2.44522 10.1396 2.44522C10.2986 2.44522 10.4279 2.57445 10.4279 2.73344C10.4279 2.89233 10.2986 3.02166 10.1396 3.02166Z"
                    fill="#1A202C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_102_333">
                    <rect width="13" height="13" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div class="group-10">
              <div class="group-7">
                <div class="ellipse-18"></div>
              </div>
              <div class="twitter-1">
                <div class="group15">
                  <svg
                    class="group16"
                    width="13"
                    height="11"
                    viewBox="0 0 13 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 1.46919C12.5166 1.68125 12.0014 1.82181 11.4644 1.89006C12.0169 1.56019 12.4386 1.04181 12.6368 0.417C12.1217 0.724125 11.5529 0.941063 10.9468 1.06213C10.4577 0.541313 9.76056 0.21875 9.00006 0.21875C7.52456 0.21875 6.33669 1.41638 6.33669 2.88456C6.33669 3.09581 6.35456 3.29894 6.39844 3.49231C4.18275 3.38425 2.22219 2.32231 0.905125 0.704625C0.675187 1.10356 0.540313 1.56019 0.540313 2.05175C0.540313 2.97475 1.01562 3.79294 1.72413 4.26662C1.29594 4.2585 0.875875 4.13419 0.52 3.93837C0.52 3.9465 0.52 3.95706 0.52 3.96762C0.52 5.26275 1.44381 6.3385 2.65525 6.58631C2.43831 6.64563 2.20187 6.67406 1.9565 6.67406C1.78587 6.67406 1.61362 6.66431 1.45194 6.62856C1.79725 7.684 2.77713 8.45994 3.94225 8.48512C3.0355 9.19444 1.88419 9.62181 0.637812 9.62181C0.41925 9.62181 0.209625 9.61206 0 9.58525C1.18056 10.3466 2.57969 10.7812 4.0885 10.7812C8.99275 10.7812 11.674 6.71875 11.674 3.19737C11.674 3.07956 11.6699 2.96581 11.6643 2.85287C12.1932 2.4775 12.6376 2.00869 13 1.46919Z"
                      fill="#1A202C"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div class="group-9">
              <div class="group-86">
                <div class="ellipse-19"></div>
              </div>
              <svg
                class="linkedin-1"
                width="11"
                height="11"
                viewBox="0 0 11 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_102_347)">
                  <path
                    d="M10.9973 10.9998V10.9993H11V6.96507C11 4.99148 10.5751 3.47119 8.26789 3.47119C7.15873 3.47119 6.41439 4.07986 6.11052 4.6569H6.07843V3.65544H3.89081V10.9993H6.16873V7.3629C6.16873 6.40544 6.35023 5.47961 7.53593 5.47961C8.70423 5.47961 8.72164 6.57228 8.72164 7.42432V10.9998H10.9973Z"
                    fill="#1A202C"
                  />
                  <path
                    d="M0.181519 3.65625H2.46219V11.0001H0.181519V3.65625Z"
                    fill="#1A202C"
                  />
                  <path
                    d="M1.32092 0C0.591708 0 0 0.591708 0 1.32092C0 2.05013 0.591708 2.65421 1.32092 2.65421C2.05013 2.65421 2.64183 2.05013 2.64183 1.32092C2.64138 0.591708 2.04967 0 1.32092 0V0Z"
                    fill="#1A202C"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_102_347">
                    <rect width="11" height="11" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div>
          <div class="links">Links</div>
          <div class="group-70">
            <div
              class="lorem-ipsum-is-simply-dummy-text-of-the-printing-and-typesetting-industry2"
            >
              Villa Espana, 158, Velachery Road, TN Police Housing Colony, Velachery, Chennai, Tamil Nadu, India
            </div>
            <div class="_908-89097-890">+919940014844 <a href="mailto:gs@vectrflow.com">gs@vectrflow.com</a></div>
            <div class="contact-us3">Contact us</div>
          </div>
        </div>
      </div>
    </div>
    <img class="google-page-speed-1" src={logo} />
    <div class="_2023-copyright-by-agency-solutions-all-rights-reserved">
      © 2023 Copyright by VectrFlow. All rights reserved.
    </div>
    <div class="line-35"></div>
  </div>
  
</div>


);

export default Hero;

import { TreePreservationData } from "./TreePreservationData/TreePreservationData";
import styles from "./Blog.module.css";
import profile_blog from "../../assets/Images/profile_blog.png";
import blog_fb from "../../assets/Icons/blog_fb.png";
import blog_x from "../../assets/Icons/blog_x.png";
import blog_linkedin from "../../assets/Icons/blog_linkedin.png";
import blog_link from "../../assets/Icons/blog_link.png";
import PostCode from "./PostCodeContainer/PostCode";
import { Helmet } from "react-helmet-async";
const Blog = () => {
  const blogUrl = window.location.href;

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      blogUrl
    )}`;
    window.open(url, "_blank");
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      blogUrl
    )}`;
    window.open(url, "_blank");
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      blogUrl
    )}`;
    window.open(url, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(blogUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <>
      <Helmet>
        <title>
          ECO4 Scheme: Expert Warns of Business Collapse & Fuel Poverty
        </title>
        <meta
          name="description"
          content="Energy expert Josh Wilson warns that axing the ECO4 scheme will spark major business closures, job losses, and rising fuel poverty across the UK."
        />
      </Helmet>
      <div className={styles.blogContainer}>
        <header
          className={styles.blogHeader}
          style={{
            backgroundImage: `
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 50%,
        rgba(0, 175, 227, 0.9) 74.73%
      ),
      url(${TreePreservationData.imgSrc})
    `,
          }}
        >
          <div className={styles.overlay}>
            <div className={styles.overlayWrap}>
              <div className={styles.headerContent}>
                <div className={styles.header_service}>
                  {TreePreservationData.service}
                </div>
                <h1>{TreePreservationData.title}</h1>
              </div>
              <div className={styles.authorInfo}>
                <div className={styles.profileWrap}>
                  <img src={profile_blog} alt="" />
                  <div className={styles.profileInner}>
                    <div>
                      <p>
                        Written by{" "}
                        <a href="https://www.linkedin.com/in/josh-wilson-a2120535a?trk=universal-search-cluster">
                          Josh Wilson
                        </a>
                      </p>
                      <p>
                        Reviewed by{" "}
                        <a href="https://www.linkedin.com/in/josh-wilson- a2120535a?trk=universal-search-cluster">
                          Michael Marshall
                        </a>
                      </p>
                    </div>
                    <div>
                      <p>Published: 28 November 2025</p>
                      <p>Updated: 28 November 2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className={styles.innerContainer}>
          <section className={styles.blogSectionDes}>
            <div className={styles.social_wrap}>
              <span>Share</span>
              {/* <div className={styles.social_Icons}>
              <img src={blog_linkedin} alt="" />
              <img src={blog_x} alt="" />
              <img src={blog_fb} alt="" />
              <img src={blog_link} alt="" />
            </div> */}
              <div className={styles.social_Icons}>
                <img
                  src={blog_linkedin}
                  alt="Share on LinkedIn"
                  onClick={shareOnLinkedIn}
                  style={{ cursor: "pointer" }}
                />

                <img
                  src={blog_x}
                  alt="Share on Twitter/X"
                  onClick={shareOnTwitter}
                  style={{ cursor: "pointer" }}
                />

                <img
                  src={blog_fb}
                  alt="Share on Facebook"
                  onClick={shareOnFacebook}
                  style={{ cursor: "pointer" }}
                />

                <img
                  src={blog_link}
                  alt="Copy blog link"
                  onClick={copyLink}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <p className={styles.timeWrap}>10 mins read time</p>
            <p className={styles.descriptionText}>
              <li>{TreePreservationData.description1}</li>
              {/* <li>{TreePreservationData.description2}</li> */}
              <li>
                {TreePreservationData.description2.split("39%")[0]}
                <a
                  href={TreePreservationData.citbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  39%
                </a>
                {TreePreservationData.description2.split("39%")[1]}
              </li>

              <li>{TreePreservationData.description3}</li>
              <li>{TreePreservationData.description4}</li>
              <p>
                <br />
                <strong>{TreePreservationData.detailTitle} </strong>
                <span>{TreePreservationData.detailDescription1}</span>
                <a href="https://www.localists.com/en/gb/">
                  {TreePreservationData.detailDescription2}
                </a>
                <span>{TreePreservationData.detailDescription3}</span>
              </p>
              <br />
              <p>{TreePreservationData.detailDescription4}</p>
              <br />
              <p>{TreePreservationData.detailDescription5}</p>
            </p>
            <img
              src={TreePreservationData.HeatPump}
              alt="Heat Pump"
              className={styles.single_tree_img}
            />
          </section>
          {TreePreservationData.sections.map((section, index) => (
            <section key={index} className={styles.blogSection}>
              {/* <h2>{section.title}</h2>
            <h3>{section.subtitle}</h3> */}
              {/* <p>{section.content}</p> */}
              <p>
                {section.content1}{" "}
                {index === 1 && (
                  <a
                    href={TreePreservationData.sections[1].CITB}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CITB.
                  </a>
                )}
              </p>
              <br />
              <p>{section.content2}</p>
              <br />
              {/* <p>{section.content3}</p> */}
              <p>
                {section.content3.includes("own data") && section.govData ? (
                  <>
                    {section.content3.split("own data")[0]}
                    <a
                      href={section.govData}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      own data
                    </a>
                    {section.content3.split("own data")[1]}
                  </>
                ) : (
                  section.content3
                )}
              </p>

              {section.extraImage && (
                <img
                  src={section.extraImage}
                  alt="Extra section visual"
                  className={styles.single_tree_img}
                />
              )}
              <h4>{section.extra}</h4>
              <p>{section.extraContent1}</p>
              <br />
              <p>{section.extraContent2}</p>
              {/* <p>{section.extraContent3}</p> */}
              {/* {section.postcode && <PostCode />} */}
            </section>
          ))}
        </div>
      </div>
    </>
  );
};

export default Blog;

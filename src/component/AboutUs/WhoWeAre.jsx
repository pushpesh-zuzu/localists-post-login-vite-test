import { Link } from "react-router-dom";
import WithBlueTextBlack from "../common/headings/WithBlueTextBlack";
import styles from "./whoweare.module.css";

const WhoWeAre = () => {
  return (
    <div className={styles.mainContainer}>
      <div style={{ marginBottom: "10px" }} className={styles.content}>
        <WithBlueTextBlack
          textalign="left"
          firstblueText="Who"
          secondText="we are"
        />
      </div>
      <p className={styles.content}>
        Localists.com is one of the fastest growing local marketplaces in the
        UK. We are transforming how local consumers connect with trusted local
        professionals. We make it easier and faster to find verified local
        service providers across home, business, and lifestyle sectors via one
        online platform.
      </p>
      <p className={styles.content}>
        Via 1 easy platform, you can submit your service needs and get
        quotations from up to 5 local, verified service providers. Save time and
        money when finding your local service providers whether you need a new
        driveway installation or a landscaper to spruce up the garden – we have
        the best local service providers ready and waiting to help you.
      </p>
      <p className={styles.content}>
        At Localists, we believe that trust and quality should never be
        compromised when it comes to your home or business. Every year, millions
        of UK households face issues with unreliable tradespeople—and we’re here
        to change that.
      </p>
      <p className={styles.content}>
        Since our launch, we’ve been dedicated to connecting people with
        verified, trusted local professionals who deliver work to the highest
        standards.
      </p>
      <div className={styles.detail}>
        <h3>Setting the Standard</h3>
        <p>
          Not just anyone can join Localists.com. Every professional is
          carefully vetted through a series of strict checks before they’re
          approved.
          <p>We verify their identity and qualifications where required</p>
          <p>
            We verify online reviews to verify consistent and quality reviews.
          </p>
          <p>
            We check that they consistently provide excellent customer service
            and quality workmanship.
          </p>
          We don’t cut corners. Last year alone, hundreds of Service Providers
          were turned away because they didn’t meet our standards.
        </p>
        <h3>Ongoing Trust & Transparency</h3>
        <p>
          Approval of our service providers isn’t a one-time process. To stay on
          Localists, professionals must maintain consistently positive reviews.
          We regularly monitor feedback and verify reviews to make sure they
          come from real people and reflect real experiences.
        </p>
        <h3>Peace of Mind for Every Customer</h3>
        <p>
          Your satisfaction and protection are our priority, giving you
          confidence every time you book through Localists which is why we place
          such rigorous standards on our service providers.
        </p>
        <p>
          With Localists, you’re not just hiring a professional—you’re choosing
          quality, reliability, and peace of mind.
        </p>
      </div>
    </div>
  );
};

export default WhoWeAre;

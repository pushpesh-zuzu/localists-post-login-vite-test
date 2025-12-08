// import { Elements, PaymentElement } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import AddCardModal from "./AddCardModal"; // path to your modal
// import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// const stripePromise = loadStripe("pk_live_51RvtSuGf1poUBxLKkKI9gWvqJZrMTQIpajKGLHwk8PwVEnvQEtzP4b0xXYG0teNs4Pq6oVhdOQluJBhN4vQovYlP00Xh1xZZbc"); // Replace with your actual publishable key

// const AddCardWrapper = ({ onClose }) => {
//     const stripe = useStripe();
//         const elements = useElements();
//     const handle = async(e)=> {
//         e.preventDefault();

//         if (!stripe || !elements) return;

//         const cardElement = elements.getElement(CardElement);

//         const { error, paymentMethod } = await stripe.createPaymentMethod({
//             type: "card",
//             card: cardElement,
//         });

//         if (error) {
//             console.error(error);
//             showToast("error", error.message);
//             return;
//         }

//         // Send this paymentMethod.id to backend via Redux action or API
//         const data = {
//             payment_method_id: paymentMethod.id, // Stripe payment method ID
//         };

//     }

//     return (
//         // <Elements stripe={stripePromise}>
//             // <AddCardModal onClose={onClose} />
//         // </Elements>
//         <PaymentElement/>
//     );
// };

// export default AddCardWrapper;

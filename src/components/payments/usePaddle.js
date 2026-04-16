import { useEffect, useState } from 'react';

const PADDLE_VENDOR_ID = Number(process.env.REACT_APP_PADDLE_VENDOR_ID) || 12345; // Default for Sandbox

export const usePaddle = () => {
    const [paddle, setPaddle] = useState(null);

    useEffect(() => {
        if (window.Paddle) {
            setPaddle(window.Paddle);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.paddle.com/paddle/paddle.js';
        script.async = true;
        script.onload = () => {
            window.Paddle.Setup({
                vendor: PADDLE_VENDOR_ID,
                eventCallback: function (data) {
                    // The data.event will specify the event name
                    if (data.event === "Checkout.Complete") {
                        console.log(data.eventData); // User, Order, Subscription details
                    }
                }
            });
            setPaddle(window.Paddle);
        };
        document.body.appendChild(script);
    }, []);

    return paddle;
};

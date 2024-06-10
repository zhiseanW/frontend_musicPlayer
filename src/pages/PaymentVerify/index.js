import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../../utils/api_payment";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { Typography } from "@mui/material";

export default function PaymentVerify() {
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // extract query string from the url
  const billplz_id = searchParams.get("billplz[id]");
  const billplz_paid = searchParams.get("billplz[paid]");
  const billplz_paid_at = searchParams.get("billplz[paid_at]");
  const billplz_x_signature = searchParams.get("billplz[x_signature]");
  console.log(billplz_id);
  console.log(billplz_paid);
  console.log(billplz_paid_at);
  console.log(billplz_x_signature);

  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (updatedOrder) => {
      // check if the order is paid or not
      // if it's paid, show the payment success message
      if (updatedOrder.status === "paid") {
        enqueueSnackbar("Payment Successful", { variant: "success" });
      }
      // if it's failed, show the payment failure message
      // if it's failed, show the payment failure message
      if (updatedOrder.status === "failed") {
        enqueueSnackbar("Payment failed", {
          variant: "error",
        });
      }
      // redirect the user to orders page
      navigate("/orders");
    },
    onError: (error) => {
      enqueueSnackbar(error.response.data.message, {
        variant: "error",
      });
    },
  });

  useEffect(() => {
    //trigger payment verification mutation when page loads
    verifyPaymentMutation.mutate({
      billplz_id: billplz_id,
      billplz_paid: billplz_paid,
      billplz_paid_at: billplz_paid_at,
      billplz_x_signature: billplz_x_signature,
    });
  }, []);

  return (
    <>
      <Typography>Verifying your payment...</Typography>
    </>
  );
}

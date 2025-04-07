'use client';

import React, { useState, useContext, useCallback, useEffect } from 'react';
import { NailModalContext } from '@/app/lib/utils/contextUtils';
import { PaymentElement, LinkAuthenticationElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeElements, StripeError } from '@stripe/stripe-js';
import { MdOutlineErrorOutline } from 'react-icons/md';
import Loading from '@/app/components/misc/Loading';
import apiService from '@/app/lib/services/apiService';
import { confirmPayment as stripeConfirmPayment } from '@/app/lib/utils/paymentUtils';
import toast from 'react-hot-toast';
import { getSession } from '@/app/lib/utils/authUtilsUI';
import { setOrderNonce } from '@/app/lib/utils/storageUtils';
import logService from '@/app/lib/services/logService';
import { ActionMode } from '@/app/lib/constants/actionMode';
import { OrderStatus } from '@/app/lib/constants/orders';

const PaymentForm = () => {
  const { state, dispatch } = useContext(NailModalContext);
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // console.log('PaymentForm state:', state);
  const checkout = useCallback(async () => {
    const session = await getSession();
    const token = session?.access_token;
    let finalResponse: any = null;
    // console.log("Checkout process.....")
    const orderData = {
      data: {
        date: state.date,
        time: state.time,
        location: state.location.value,
        personId: state.person.id,
        categoryId: state.person.categoryId,
        amount: state.totalPrice,
        status: OrderStatus.created,
        services: state.services.filter((item: Record<string, any>) => item.quantity > 0),
        userId: state.user.userId,
        uuid: state.uuid,
      },
      token,
    };

    // if (state.actionMode === ActionMode.Create) {
    //   const responseCreateOrder = await apiService.orders.post({
    //     data: { ...orderData.data, paymentIntentId: "" },
    //     // data: { ...orderData.data, paymentIntentId: responseCheckout.data.payment_intent_id },
    //     token: orderData.token,
    //   });
    //   finalResponse = {
    //     ...responseCreateOrder,
    //     data: {
    //       order: responseCreateOrder.data,
    //     }
    //   };
    // }

    if (state.actionMode === ActionMode.Checkout) {
      const responseCheckout = await apiService.checkout.post(state.totalPrice);
      finalResponse = {
        ...responseCheckout,
        data: {
          ...responseCheckout.data,
          order: orderData.data,
        }
      };
    }

    return finalResponse;

    // return {
    //   ...responseCheckout,
    //   data: {
    //     ...responseCheckout.data,
    //     order: responseCreateOrder.data,
    //   },
    // };
  }, [
    state.date,
    state.location.value,
    state.person.categoryId,
    state.person.id,
    state.services,
    state.time,
    state.totalPrice,
  ]);

  const confirmPayment = useCallback(
    async (elements: StripeElements, clientSecret: string, orderUuid: string) => {
      const nonce = setOrderNonce(orderUuid);
      const response = await stripeConfirmPayment(stripe, elements, clientSecret, orderUuid, nonce);

      return response;
    },
    [stripe],
  );

  const onSubmit = useCallback(async () => {
    // console.log('onSubmit called...');
    toast.remove();
    if (elements == null) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: submitError } = await elements.submit();

      if (submitError) {
        toast.error(submitError.message as string);
        return;
      }

      const checkoutResponse = await checkout();
      // console.log('Checkout response: ', checkoutResponse);
      const session = await getSession();
      const token = session?.access_token;

      if (!checkoutResponse.success) {
        toast.error(checkoutResponse.data.message as string);
        return;
      } else {

        const updateResponse = await apiService.orders.update({
          data: {
            id: state.orderId,
            paymentIntentId: checkoutResponse.data.payment_intent_id,
          },
          token: token,
        });
        if (updateResponse && updateResponse.success) {
          toast.success("Payment Intent ID updated");
        } else {
          toast.error("Failed to update payment intent ID");
        }

      }
      // Checkout Mode: Confirm Payment
      if (state.actionMode === ActionMode.Checkout) {
        const confirmPaymentResponse = await confirmPayment(
          elements,
          checkoutResponse.data.client_secret,
          checkoutResponse.data.order.uuid,
        );

        if (!confirmPaymentResponse.success) {
          toast.error((confirmPaymentResponse.data as StripeError).message as string);
          return;
        }
      }

    } catch (error) {
      console.log('Error in payment form: ', error);
      logService.log(error);
      toast.error('Something went wrong. Please try again later.');
      //TODO: update order with status: "Incomplete"
    } finally {
      setIsLoading(false);
      dispatch({ type: 'setProceedCheckout', payload: false });
    }
  }, [checkout, confirmPayment, dispatch, elements]);

  useEffect(() => {
    if (state.proceedCheckout) {
      onSubmit();
    }
  }, [onSubmit, state.proceedCheckout]);

  return (
    <form id="payment-form" className="relative flex flex-col item-center w-full">
      {errorMessage && (
        <div role="alert" className="alert alert-error py-3 text-white text-sm mb-4">
          <MdOutlineErrorOutline className="w-[24px] h-[24px]" />
          <span>{errorMessage}</span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <PaymentElement
          id="payment-element"
          className="w-full"
          onLoadError={() => {
            setErrorMessage('An error occurred while loading payment module. Please try again.');
          }}
          onReady={() => {
            setErrorMessage(null);
          }}
          onChange={(e) => {
            dispatch({ type: 'setIsPaymentInformationComplete', payload: e.complete });
          }}
        />
        <LinkAuthenticationElement
          id="link-authentication-element"
          className="w-full"
          options={{
            defaultValues: {
              email: state.user.email,
            },
          }}
          onLoadError={() => {
            setErrorMessage('An error occurred while loading payment module. Please try again.');
          }}
          onReady={() => {
            setErrorMessage(null);
          }}
          onChange={(e) => {
            dispatch({ type: 'setIsPaymentEmailAddressComplete', payload: e.complete });
          }}
        />
      </div>
      {isLoading && (
        <div className="absolute bottom-0 left-0 w-full h-full flex justify-center items-center bg-white/90">
          <Loading className="text-primary" size="large" />
        </div>
      )}
    </form>
  );
};

export default PaymentForm;

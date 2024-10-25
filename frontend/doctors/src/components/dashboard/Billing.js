"use client";
import React, { useState, useEffect } from "react";
import { usePayment } from "../../context/billingContext";

const Billing = () => {
  const { payments, loading, error, fetchPayments, addPayment, deletePayment } =
    usePayment();
  const [method, setMethod] = useState("");
  const [phone, setPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [clickPaymentButton, setClickPaymentButton] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPayment = { method, phone, transaction_ref: transactionRef };
    await addPayment(newPayment);
    setMethod("");
    setPhone("");
    setTransactionRef("");
    setClickPaymentButton(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white my-8 shadow-md rounded-md">
      {payments.length < 1 && !clickPaymentButton && (
        <div className="flex flex-col justify-self-center">
          <h2 className="text-2xl font-bold mb-6 text-center">
            No Billing Information Found!
          </h2>
          <button
            onClick={() => setClickPaymentButton(true)} // Correct event handler
            className="w-60 m-auto text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
          >
            Add Payment
          </button>
        </div>
      )}

      {clickPaymentButton && (
        <>
          <h2 className="text-2xl font-bold mb-6">Billing</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Method
              </label>
              <input
                type="text"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Transaction Reference
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              Submit Payment
            </button>
          </form>
        </>
      )}

      {error && <div className="text-red-500 mt-4">{error}</div>}

      {loading ? (
        <div className="mt-4 flex justify-center items-center">
          <svg
            className="animate-spin h-5 w-5 text-indigo-600 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-indigo-600 text-lg font-semibold">
            Processing...
          </span>
        </div>
      ) : (
        payments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Payment Records</h3>

            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4">{payment.method}</td>
                    <td className="px-6 py-4">{payment.phone}</td>
                    <td className="px-6 py-4">{payment.transaction_ref}</td>
                    <td className="px-6 py-4">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deletePayment(payment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default Billing;

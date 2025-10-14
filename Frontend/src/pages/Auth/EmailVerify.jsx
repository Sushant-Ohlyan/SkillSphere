import axios from "axios";
import React, { useContext, useEffect, useRef } from "react";
import { AppContent } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
  const inputRefs = useRef([]);

  // ✅ Move focus to next input when user types a digit
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // ✅ Move focus back on backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ✅ Handle paste of full 6-digit OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });

    // Automatically focus next empty field or submit if all filled
    const filledCount = pasteArray.length;
    if (filledCount < 6 && inputRefs.current[filledCount]) {
      inputRefs.current[filledCount].focus();
    }
  };

  // ✅ Submit handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otpArray = inputRefs.current.map((input) => input.value);
      const otp = otpArray.join("");

      if (otp.length !== 6) {
        alert("Please enter the full 6-digit OTP");
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-otp`, { otp });

      if (data.success) {
        alert("Email verified successfully!");
        getUserData();
        navigate("/");
      } else {
        alert(data.message || "Verification failed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // ✅ Redirect if already verified
  useEffect(() => {
    if (isLoggedin && userData?.isVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Email Verification</h2>
      <form onSubmit={onSubmitHandler}>
        <p>Enter the 6-digit code sent to your email</p>
        <div
          onPaste={handlePaste}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                key={index}
                maxLength="1"
                required
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                style={{
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  fontSize: "18px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            ))}
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;

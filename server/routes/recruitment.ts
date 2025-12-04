import { RequestHandler } from "express";

export const handleRecruitmentData: RequestHandler = async (_req, res) => {
  try {
    console.log("Recruitment endpoint called");
    const googleScriptUrl =
      "https://script.google.com/macros/s/AKfycbyjlSMF3hCNzt9Ifa_jox3NdRAlfHzNYwzaZtdvoZ7YKYY4qyOKQ45M4rdZtX4ryJTu/exec";
    console.log("Fetching from:", googleScriptUrl);

    // Set response headers
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("Recruitment fetch timeout triggered");
      controller.abort();
    }, 45000);

    let response;
    try {
      response = await fetch(googleScriptUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("Recruitment fetch timeout or aborted");
        return res.status(504).json({
          error: "Gateway Timeout",
          message: "Google Script request timed out",
        });
      }
      console.error("Fetch network error:", fetchError);
      throw fetchError;
    }

    clearTimeout(timeout);
    console.log("Response status:", response.status, "Content-Type:", response.headers.get("content-type"));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Google Script error response:", errorText);
      throw new Error(`Google Script returned ${response.status}`);
    }

    const data = await response.json();
    console.log("Data fetched successfully, records:", Array.isArray(data) ? data.length : "unknown");

    // Ensure we're sending valid JSON
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching recruitment data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    res.status(500).json({
      error: "Failed to fetch recruitment data",
      message: errorMessage,
    });
  }
};

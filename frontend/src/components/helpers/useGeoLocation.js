import React, { useState, useEffect } from "react";
import axios from "axios";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
    countryName: "",
    countryCodeISO3: "",
  });

  const onSuccess = (location) => {
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        const country_data = response.data;
        setLocation({
          ...location,
          loaded: true,
          coordinates: {
            lat: location.coords.latitude,
            lng: location.coords.longitude,
          },
          countryName: country_data.country_name,
          countryCodeISO3: country_data.country_code_iso3,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    const stored_location = JSON.parse(localStorage.getItem("stored_location"));
    if (!stored_location) {
      if (!("geolocation" in navigator)) {
        onError({
          code: 0,
          message: "Geolocalización no soportada por el browser",
        });
      }
      navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
  }, []);

  return location;
};

export default useGeoLocation;

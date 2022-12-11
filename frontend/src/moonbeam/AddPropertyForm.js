import { BigNumber, ethers, FixedNumber, utils } from "ethers";
import React, { useEffect, useContext, useState } from "react";
import ContextWeb3 from "./ContextWeb3";
import ContractABI from "../abi/ContractABI.json";
import { API_URL } from "./Profile";
import useGeoLocation from "../components/helpers/useGeoLocation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MessageToast from "./MessageToast";
import axios from "axios";

const IMAGE_URL = process.env.REACT_APP_IMAGE_URL;
export const contractAddress = utils.getAddress(
  "0xdCa6d6E8f4E69C3Cf86B656f0bBf9b460727Bed9"
);

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

const AddPropertyForm = () => {
  const { state } = useContext(ContextWeb3);
  const location = useGeoLocation();
  const stored_location = JSON.parse(localStorage.getItem("stored_location"));

  const [category] = useState([
    "Departamento",
    "Duplex",
    "Casa",
    "Industrial",
    "Terreno",
    "Oficina",
  ]);

  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
    attributes: [],
  });

  const [image, setImage] = useState();

  const [attributes, setAttributes] = useState([
    {
      trait_type: "Rooms",
      value: 0,
    },
    {
      trait_type: "Size",
      value: 0,
    },
    {
      trait_type: "Category",
      value: "",
    },
  ]);

  const [property, setProperty] = useState({
    timestamp: BigNumber.from(new Date().getTime()),
    tokenId: 0,
    owner: "",
    price: "", //uint
    images: "",
    latitude: "", //int
    longitude: "", //int
    idCategory: "", //uint
    ISOCountry: "",
    staticData: {
      title: "",
      description: "",
      location: "",
      rooms: "", //uint
      size: "", //uint8
    },
  });

  useEffect(() => {
    if (state.address && property.owner === "") {
      setProperty({
        ...property,
        owner: state.address,
      });
    }
    console.log(property);
    console.log(metadata);
  }, [property, state.address, location, metadata]);

  const handleChange = (e) => {
    if (e.target.name === "idCategory") {
      setProperty({ ...property, [e.target.name]: parseInt(e.target.value) });
    } else if (e.target.name === "latitude" || e.target.name === "longitude") {
      console.log(e.target.value);
      if (
        e.target.value === "00" ||
        e.target.value === "0." ||
        e.target.value === ""
      ) {
        setProperty({ ...property, [e.target.name]: 0 });
      } else {
        setProperty({
          ...property,
          [e.target.name]: FixedNumber.from(`${e.target.value}`, "fixed128x18"),
        });
      }
    } else if (
      e.target.name === "title" ||
      e.target.name === "description" ||
      e.target.name === "location"
    ) {
      setProperty({
        ...property,
        staticData: { ...property.staticData, [e.target.name]: e.target.value },
      });
      if (e.target.name === "title") {
        setMetadata({
          ...metadata,
          name: e.target.value,
        });
      } else {
        setMetadata({
          ...metadata,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name === "price") {
      setProperty({
        ...property,
        [e.target.name]: BigNumber.from(parseInt(e.target.value)),
      });
    } else if (e.target.name === "rooms" || e.target.name === "size") {
      setProperty({
        ...property,
        staticData: {
          ...property.staticData,
          [e.target.name]: parseInt(e.target.value),
        },
      });
      if (e.target.name === "rooms") {
        setAttributes([
          {
            trait_type: "Rooms",
            value: parseInt(e.target.value),
          },
          {
            trait_type: "Size",
            value: attributes[1].value,
          },
          {
            trait_type: "Category",
            value: attributes[2].value,
          },
        ]);
      }
      if (e.target.name === "size") {
        setAttributes([
          {
            trait_type: "Rooms",
            value: attributes[0].value,
          },
          {
            trait_type: "Size",
            value: parseInt(e.target.value),
          },
          {
            trait_type: "Category",
            value: attributes[2].value,
          },
        ]);
      }
    } else {
      setProperty({ ...property, [e.target.name]: e.target.value });
    }
  };

  const handleLocation = (e) => {
    if (location.loaded && location.coordinates) {
      console.log("entro aca");
      // let lat = FixedNumber.from(`${location.coordinates.lat}`, "fixed128x18");
      // let lng = FixedNumber.from(`${location.coordinates.lng}`, "fixed128x18");
      setProperty({
        ...property,
        latitude: FixedNumber.from(
          `${location.coordinates.lat}`,
          "fixed128x18"
        ),
        longitude: FixedNumber.from(
          `${location.coordinates.lng}`,
          "fixed128x18"
        ),
      });
    }
    if (stored_location.ISOCountry !== "") {
      setProperty({
        ...property,
        latitude: FixedNumber.from(
          stored_location.latitude._value,
          "fixed128x18"
        ),
        longitude: FixedNumber.from(
          stored_location.longitude._value,
          "fixed128x18"
        ),
      });
    }
  };

  const handleChangeCategory = (e) => {
    setProperty({
      ...property,
      idCategory: parseInt(e.target.value),
    });
    setAttributes([
      {
        trait_type: "Rooms",
        value: attributes[0].value,
      },
      {
        trait_type: "Size",
        value: attributes[1].value,
      },
      {
        trait_type: "Category",
        value: category[e.target.value],
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      property.images === "" ||
      property.title === "" ||
      property.description === "" ||
      property.price === "" ||
      property.location === "" ||
      property.rooms === "" ||
      property.category === "" ||
      property.latitude === "" ||
      property.longitude === ""
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    setMetadata((prev) => {
      return {
        ...prev,
        image: property.images,
        attributes: attributes,
      };
    });

    const form = new FormData();
    form.append("file", image);
    form.append("name", metadata.name);
    form.append("description", metadata.description);
    form.append("attributes", attributes);

    const uri = await axios
      .post(`${API_URL}/nft-storage`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      });

    setProperty((prev) => {
      return {
        ...prev,
        images: [uri],
      };
    });

    console.log(property);

    const id = toast.loading(
      "Transacción en progreso. Por favor, espere la confirmación...",
      {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      }
    );
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner(state.address);
        const contract = new ethers.Contract(
          contractAddress,
          ContractABI,
          signer
        );

        await contract
          .createAsset(property)
          .then((tx) => {
            console.log(tx);
            toast.update(id, {
              render: `
              Transacción realizada correctamente! 🎉
              `,
              type: "success",
              isLoading: false,
              autoClose: 5000,
            });
            toast(<MessageToast txHash={tx.hash} />, {
              autoClose: 5000,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
      handleReset();
    } catch (error) {
      console.log("error", error);
      toast.update(id, {
        render: "Algo salió mal",
        type: "error",
        isLoading: false,
      });
    }
    return;
  };

  const handleImage = async (e) => {
    e.preventDefault();
    const postId = uuidv4();
    const file = e.target.files[0];
    const blob = file.slice(0, file.size, "image/jpeg");
    const newFile = new File([blob], `${postId}_post.jpeg`, {
      type: "image/jpeg",
    });
    const formData = new FormData();
    formData.append("images", newFile);
    await fetch(`${API_URL}/upload`, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then((response) => console.log(response))
      .then(() => {
        setProperty({
          ...property,
          images: [IMAGE_URL + newFile.name],
        });
        setImage(newFile);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleReset = (e) => {
    e.preventDefault();
    setProperty({
      timestamp: "",
      tokenId: 0,
      owner: "",
      price: "", //uint
      images: "",
      latitude: "", //int
      longitude: "", //int
      idCategory: "", //uint
      ISOCountry: "",
      staticData: {
        title: "",
        description: "",
        location: "",
        rooms: "", //uint
        size: "", //uint8
      },
    });
  };

  return (
    <div className="ltn__myaccount-tab-content-inner">
      <h1>Agregar nueva propiedad</h1>
      <br />
      <h6>Descripcion de la propiedad</h6>
      <div className="row">
        <div className="col-md-12">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="title"
              placeholder="*Titulo*"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="input-item input-item-textarea ltn__custom-icon">
            <textarea
              name="description"
              placeholder="Descripcion"
              onChange={(e) => handleChange(e)}
              defaultValue={""}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h6>Precio</h6>
          <div className="input-item  input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="price"
              placeholder="$"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>

        <div className="col-md-6">
          <h6>Seleccionar Categoria</h6>
          <div className="input-item">
            <select
              className="nice-select"
              name="category"
              onChange={handleChangeCategory}
            >
              {category.map((cat, idx) => (
                <option key={idx} value={idx} name="category">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <h6>Fotos</h6>
      <input
        type="file"
        id="myFile"
        name="images"
        className="btn theme-btn-3 mb-10"
        onChange={handleImage}
      />
      <br />
      <p>
        <small>* Ingrese al menos una imagen superior a 500x500px.</small>
        <br />
        <small>* Pueden ingresarse archivos PDF.</small>
        <br />
        <small>* Las imagenes pueden demorar en procesarse.</small>
      </p>
      <h6>Ubicación</h6>
      <div className="row">
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="location"
              placeholder="Dirección*"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="ISOCountry"
              placeholder="País"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="ltn__name"
              placeholder="Provincia / Estado / Departamento"
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input type="text" name="ltn__name" placeholder="Ciudad" />
          </div>
        </div>
        {/* <div className="col-lg-12">
          <div className="property-details-google-map mb-60">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9334.271551495209!2d-73.97198251485975!3d40.668170674982946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25b0456b5a2e7%3A0x68bdf865dda0b669!2sBrooklyn%20Botanic%20Garden%20Shop!5e0!3m2!1sen!2sbd!4v1590597267201!5m2!1sen!2sbd"
              width="100%"
              height="100%"
              frameBorder={0}
              allowFullScreen
              aria-hidden="false"
              tabIndex={0}
            />
          </div>
        </div> */}

        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="latitude"
              value={property.latitude}
              placeholder="Latitud (Google Maps)"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="longitude"
              value={property.longitude}
              placeholder="Longitud (Google Maps)"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6" style={{ marginBottom: "1rem" }}>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              disabled={!location.coordinates}
              onChange={(e) => handleLocation(e)}
            />
            &nbsp; Cargar ubicación automaticamente
          </label>
        </div>
      </div>
      <h6>Detalles de la publicación</h6>
      <div className="row">
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="rooms"
              placeholder="Ambientes (Único Obligatorio)"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="size"
              placeholder="Tamaño (m2)"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="bathrooms"
              placeholder="Baños"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="garages"
              placeholder="Garages"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="basement"
              placeholder="Sotano"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="terrace"
              placeholder="Terraza"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        {/* <div className="col-md-6">
          <div className="input-item">
            <select className="nice-select" name="structure">
              <option name="category">Tipo de estructura</option>
              <option name="category">Madera</option>
              <option name="category">Bloque</option>
              <option name="category">Ladrillo</option>
            </select>
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-item">
            <select className="nice-select" name="structure">
              <option name="category">Pisos</option>
              <option name="category">1</option>
              <option name="category">2</option>
              <option name="category">3</option>
              <option name="category">4+</option>
            </select>
          </div>
        </div> */}

        {/* <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="ltn__name"
              placeholder="Año de Construcción"
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="input-item input-item-textarea ltn__custom-icon">
            <input
              type="text"
              name="ltn__name"
              placeholder="Disponible desde... "
            />
          </div>
        </div> */}
      </div>

      <div className="btn-wrapper text-center--- mt-30">
        <button
          className="btn theme-btn-1 btn-effect-1 text-uppercase"
          type="submit"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Guardar propiedad
        </button>
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default AddPropertyForm;

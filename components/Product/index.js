import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import Comments from "../Comments";
import { useState } from "react";
import { StyledButton } from "../Button/Button.styled";
import ProductForm from "../ProductForm";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);
  const [isEditMode, setIsEditMode] = useState(false);

  async function handleEditProduct(event) {
    //Formsubmit ist normales Browserevent, wird als Argument übergeben, um z.B. event.preventDefault aufrufen zu können
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (response.ok) {
      mutate();
    }
  }

  async function handleDeleteProduct(id) {
    const confirmation = window.confirm(
      "Are you sure you want to delete this fish?"
    );
    if (confirmation) {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/");
      }
      if (!response.ok) {
        console.log("response not okay:", response.status);
      }
    }
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  return (
    <ProductCard>
      <h2>{data.name}</h2>
      <p>Description: {data.description}</p>
      <p>
        Price: {data.price} {data.currency}
      </p>

      <StyledButton
        type="button"
        onClick={() => {
          setIsEditMode(!isEditMode);
          console.log("Edit button wurde geklickt!");
        }}
      >
        Edit
      </StyledButton>
      <StyledButton
        type="button"
        onClick={() => {
          handleDeleteProduct(id);
          console.log("Edit button wurde gelöscht!");
        }}
      >
        Delete
      </StyledButton>
      {data.reviews.length > 0 && <Comments reviews={data.reviews} />}
      <StyledLink href="/">Back to all</StyledLink>
      {isEditMode && (
        <ProductForm onSubmit={handleEditProduct} heading="Edit product" />
      )}
    </ProductCard>
  );
}

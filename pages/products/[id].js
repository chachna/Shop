// pages/products/[id].js
import { supabase } from '../../lib/supabase';

export default function Product({ product }) {
  if (!product) return <p>Produit non trouvé</p>;
  return (
    <main style={{padding:20}}>
      <h1>{product.name}</h1>
      <img src={product.image_url || '/placeholder.png'} alt={product.name} style={{width:400}} />
      <p>{product.description}</p>
      <p>Prix: {product.price} €</p>

      <h3>Commander</h3>
      <form method="post" action={`/api/order`}>
        <input type="hidden" name="product_id" value={product.id} />
        <div><input name="customer_name" required placeholder="Nom" /></div>
        <div><input name="customer_email" required placeholder="Email" /></div>
        <div><input name="quantity" type="number" defaultValue="1" min="1"/></div>
        <div><textarea name="note" placeholder="Message (optionnel)"/></div>
        <button type="submit">Envoyer commande</button>
      </form>
    </main>
  );
}

export async function getServerSideProps({ params }) {
  const { data } = await supabase.from('products').select('*').eq('id', params.id).single();
  if (!data) return { props: { product: null } };

  const image_url = data.image_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${data.image_path}` : null;
  return { props: { product: { ...data, image_url } } };
}

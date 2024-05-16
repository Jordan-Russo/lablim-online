import { supabaseClient as supabase } from '../config/supabase-client';
import {useAuth} from '../hooks/Auth'

// Given an ID, given a setter
// Check if favorite
// update setter
export async function CheckFavorite(id, setter){
  const { user: {id: userId}} = useAuth()
      const { data, error } = await supabase
      .from('countries')
      .select('product_id')
      .eq('product_id', id)
      .eq('user_id', userId)
      .limit(1)

     /* select count(*) 
        from countries 
        where 'product_id' = id 
        and 'user_id' = userId 
        limit 1; */

    const codes = data.map(({product_id}) => product_id).join(',')
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/search?code=${codes}&page_size=24&page=1&sort_by=popularity_key&fields=code,product_name_en,nutrition_grades,image_thumb_url,brands,quantity,ecoscore_grade`)
    // handle error
    const {products} = await res.json()
    setter(products)
  
  if(error){
    console.error(`Error fetching data: ${error.message}`)
  }
}

export async function getProducts(setter, name) {
  // use FoodFactsAPI to get the data for products that match 
  // setState and display them
  // fetch url needs to be changed.
  // console.log(`1 request sent for:`, name)
  const res = await fetch(`https://world.openfoodfacts.org/api/v2/search?page_size=24&page=1&sort_by=popularity_key&fields=code,product_name_en,nutrition_grades,image_thumb_url,brands,quantity,ecoscore_grade&countries_tags_en=united-states&categories_tags_en=${name}`)
  // handle error
  const {products} = await res.json()
  // console.log(products)
  setter(products)
}

export async function getProduct(setter, id) {
  // use FoodFactsAPI to get the data for products that match 
  // setState and display them.
  try{
    // console.log(`1 request sent for:`, id)
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${id}?fields=code,product_name_en,nutrition_grades,image_thumb_url,brands,quantity,ecoscore_grade,image_url,energy-kcal_100g,carbohydrates_100g,fat_100g,fiber_100g,proteins_100g,sodium_100g,sugars_100g,image_nutrition_url,allergens_tags,traces_tags,ingredients_text,image_ingredients_url`
      )
      // handle error
      const {product} = await res.json()
      // console.log(product)
      setter(product)
  }
  catch(err){
    console.error('Error while getting product', err)
  }
}



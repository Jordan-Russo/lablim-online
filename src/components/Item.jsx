// import WarningList from "./WarningList";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/Auth";
// import { supabaseClient as supabase } from '../config/supabase-client';

// export default function Item({
//   product, isFavorited, setFavorite
// }) {

//   const {user} = useAuth()
//   const navigate = useNavigate()

//   const {
//     code: id,
//     image_url: img,
//     image_thumb_url: small_img,
//     brands,
//     quantity,
//     product_name_en: name,
//     nutrition_grades: nutriscore,
//     ecoscore_grade: ecoscore,
//     "energy-kcal_100g": calories,
//     carbohydrates_100g: carbs,
//     fat_100g: fat,
//     fiber_100g: fiber,
//     proteins_100g: protein,
//     sodium_100g: sodium,
//     sugars_100g: sugar,
//     allergens_tags: allergens,
//     traces_tags: traces,
//     image_nutrition_url: nutritionFactsImg,
//     ingredients_text,
//     image_ingredients_url
//   } = product;

//     const itemTitle = makeDescription({brands, name, quantity});
//     const isDetailed = Boolean(traces || allergens)
//     const hasUser = Boolean(user)
//     // use detailed status to add additional styling on to the results
//     async function handleClick(e) {
//       if(!isDetailed){
//       navigate(`/product/${id}`)
//     }
//   }
//   function toggleFavorite(){
//     const userId = user?.id
//     if(isFavorited){
//       // remove record(s)
//       removeFavorite(userId, id)
//     }else{
//       // add record
//       addFavorite(userId, id)
//     }
//   }

//   async function addFavorite(userId, productId){
//     const { error } = await supabase
//       .from('favorites')
//       .insert({ user_id: userId, product_id: `${productId}` })
//       /*  insert into favorites (
//         'user_id', 'product_id'
//       ) values (
//         userId, productId
//       );

//       */
//     if(!error){
//       setFavorite(true)
//     }else{
//       console.error('Error while calling addFavorite', error)
//     }
//   }
//   async function removeFavorite(userId, productId){
//     const { error } = await supabase
//       .from('favorites')
//       .delete()
//       .eq('user_id', userId)
//       .eq('product_id', productId)
//       /* 
//       delete from favorites
//       where 'user_id' = userId
//       and 'product_id' = productId
//       */
//     if(!error){
//       setFavorite(false)
//     }else{
//       console.error('Error while calling removeFavorite', error)
//     }
//   }
//   return (
//     <div className='item' id={id} onClick={handleClick} style={{
//       padding: '15px 15px 5px 15px',
//       background: '#fff6',
//       border: 'black solid 3px',
//       borderRadius: 10,
//         maxWidth: 500,
//         width: 250,
//         flexGrow: 1,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         gap: 5
//       }}
//     >
//       {isDetailed 
//       && <h1 className="text-6xl">{itemTitle}</h1>
//       }
//       <img className={`${isDetailed ? 'item-large' : ''}`} src={(isDetailed ? img : small_img) || '/images/default-product-image.svg'} alt={itemTitle} title={itemTitle} style={isDetailed ? 
//         {
//           height: 'auto',
//           maxHeight: 500
//         } 
//         : 
//         {
//           maxWidth: '90%',
//           minHeight: 144,
//           height: 144
//         }} 
//       />
//       {isDetailed || <h2 className="text-4xl" style={{textWrap: 'balance',
//   wordBreak: 'break-word', fontSize: '1.6rem', lineHeight: '1.6rem'}}>{itemTitle}</h2>}
//       <div className="icon-container" style={{display: 'flex'}}>
//         <img className="icon" src={`/images/nutriscore/nutriscore-${ecoscore?.length === 1 ? ecoscore : 'unknown'}.svg`} style={{maxWidth: hasUser && isDetailed ? '33%' : '50%'}}/>
//         <img className="icon" src={`/images/ecoscore/ecoscore-${ecoscore?.length === 1 ? ecoscore : 'unknown'}.svg`} style={{maxWidth: hasUser && isDetailed ? '33%' : '50%'}}/>
//         {hasUser && isDetailed && <img src={isFavorited ? "/favorite.svg" : "/unfavorite.svg"} style={{maxHeight: '100%'}} onClick={toggleFavorite}/>}
//       </div>
//       {/* More details for item specific search */}
//       {isDetailed &&
//         <>
//           <h2 className="text-4xl">Nutrition:</h2>
//           <table>
//             <thead>
//               <tr>
//                 <th colSpan="2">Nutritional Facts (per 100 g/ml)</th>
//               </tr>
//             </thead>
//             <tbody>
//               {typeof calories === 'number' &&
//                 <tr>
//                   <td>
//                     Calories
//                   </td>
//                   <td>
//                     {calories.toFixed(0)}
//                   </td>
//                 </tr>
//               }
//               {typeof carbs === 'number' &&
//                 <tr>
//                   <td>
//                     Carbs
//                   </td>
//                   <td>
//                     {carbs.toFixed(1) + 'g'}
//                   </td>
//                 </tr>
//               }
//               {typeof fat === 'number' &&
//                 <tr>
//                   <td>
//                     Fat
//                   </td>
//                   <td>
//                     {fat.toFixed(1) + 'g'}
//                   </td>
//                 </tr>
//               }
//               {typeof fiber === 'number' &&
//                 <tr>
//                   <td>
//                     Fiber
//                   </td>
//                   <td>
//                     {fiber.toFixed(1) + 'g'}
//                   </td>
//                 </tr>
//               }
//               {typeof protein === 'number' &&
//                 <tr>
//                   <td>
//                     Protein
//                   </td>
//                   <td>
//                     {protein.toFixed(1) + 'g'}
//                   </td>
//                 </tr>
//               }
//               {typeof sodium === 'number' &&
//                 <tr>
//                   <td>
//                     Sodium
//                   </td>
//                   <td>
//                     {sodium.toFixed(1) + 'g'}
//                   </td>
//                 </tr>
//               }
//               {typeof sugar === 'number' &&
//                 <tr>
//                   <td>
//                     Sugar
//                   </td>
//                   <td>
//                     {sugar.toFixed(0) + 'g'}
//                   </td>
//                 </tr>
//               }
//             </tbody>
//           </table>
//           <img src={nutritionFactsImg} />
//           {(ingredients_text || image_ingredients_url) && <h2 className="text-4xl">Ingredients:</h2>}
//           {ingredients_text && <p>{ingredients_text}</p>}
//           {image_ingredients_url && 
//             <img src={image_ingredients_url} alt="Ingredients"/>
//           }
//           </>
//       }
//       <WarningList name="Allergens" prefix="en:" items={allergens}/>
//       <WarningList name="Traces" prefix="en:" items={traces}/>
//       <h5 className="text-xl">code - {id}</h5>
//     </div>
//   )
// }

// function makeDescription({name, brands, quantity}){return [brands, name, quantity].filter(Boolean).join(' - ')}

// // function that onclick sets the state of the matches
// // changes the matches


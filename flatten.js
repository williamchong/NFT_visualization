const glob = require('glob');
const path = require('path');

const items = []
glob.sync("./output/**.json").forEach(function (file) {
  items.push(require(path.resolve(file)));
});

const allTraits = new Set();
console.log('id,num_sales,image_url,name,owner_address,last_sale_total_price,last_sale_token_id,traits_sex,traits_count,traits_list');
items.forEach(item => {
  const {
    id,
    num_sales,
    image_url,
    name,
    owner: { address },
    last_sale,
    traits,
  } = item
  let total_price = null;
  let token_id = null;
  if (last_sale) ({ total_price, asset: { token_id } = {} } = last_sale);
  const traits_sex = traits.find(t => t.trait_type === 'type').value;
  const traits_items = traits.filter(t => !t.value.endsWith('attributes') && t.trait_type === 'accessory').map(t => t.value);
  const traits_count = traits_items.length;
  traits_items.forEach(item => allTraits.add(item));
  const traits_list = traits_items.join(',');
  console.log(`${id},${num_sales},${image_url},${name},${address},${total_price},${token_id},${traits_sex},${traits_count},"${traits_list}"`)
})

console.log('======');
const total_trait_list = Array.from(allTraits).join(',');
console.log(`total_trait_list: ${total_trait_list}`);


const ASSETS = {
  // UI และพื้นหลัง
  logo: "Asset/Malatang_Logo.png",
  bgTile:
    "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='363' height='443' viewBox='0 0 363 443'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.06' stroke-width='4'%3E%3Ccircle cx='0' cy='0' r='165'/%3E%3Ccircle cx='0' cy='0' r='132'/%3E%3Ccircle cx='0' cy='0' r='99'/%3E%3Ccircle cx='0' cy='0' r='66'/%3E%3Ccircle cx='0' cy='0' r='33'/%3E%3Ccircle cx='363' cy='0' r='165'/%3E%3Ccircle cx='363' cy='0' r='132'/%3E%3Ccircle cx='363' cy='0' r='99'/%3E%3Ccircle cx='363' cy='0' r='66'/%3E%3Ccircle cx='363' cy='0' r='33'/%3E%3Ccircle cx='181.5' cy='221.5' r='165'/%3E%3Ccircle cx='181.5' cy='221.5' r='132'/%3E%3Ccircle cx='181.5' cy='221.5' r='99'/%3E%3Ccircle cx='181.5' cy='221.5' r='66'/%3E%3Ccircle cx='181.5' cy='221.5' r='33'/%3E%3Ccircle cx='0' cy='443' r='165'/%3E%3Ccircle cx='0' cy='443' r='132'/%3E%3Ccircle cx='0' cy='443' r='99'/%3E%3Ccircle cx='0' cy='443' r='66'/%3E%3Ccircle cx='0' cy='443' r='33'/%3E%3Ccircle cx='363' cy='443' r='165'/%3E%3Ccircle cx='363' cy='443' r='132'/%3E%3Ccircle cx='363' cy='443' r='99'/%3E%3Ccircle cx='363' cy='443' r='66'/%3E%3Ccircle cx='363' cy='443' r='33'/%3E%3C/g%3E%3C/svg%3E",
  s1: "Asset/Step_1_icon.png",
  s2: "Asset/Step_2_icon.png",
  s3: "Asset/Step_3_icon.png",
  bowl: "Asset/Empty_Bowl.png",
  bowlPlastic: "Asset/Empty_Plastic_Bowl.png",
  sbowl: "Asset/Empty_Sauce_Bowl.png",
  pot: "Asset/Mala_Emtpy_Pot.png",

  // น้ำซุป
  soupRed: "Asset/Sichuan-style_spicy_red_mala_soup.png",
  soupWhite: "Asset/Original_Mala_Soup.png",
  soupBone: "Asset/Pork_bone_soup.png",
  soupShabu: "Asset/Black_Shabu_Soup.png",
  soupMilk: "Asset/Mala_Milk_Soup.png",

  // เครื่องปรุง
  sesame: "Asset/Sesame_sauce.png",
  garlic: "Asset/Garlic.png",
  chilli: "Asset/Chilli.png",
  sukki: "Asset/Sukki_Sauce.png",
  corian: "Asset/Coriander_leaves.png",
  malaoil: "Asset/Mala_Oil_Sauce.png",
  soy: "Asset/Soy_Sauce.png",
  worce: "Asset/Worcestershire_Sauce.png",

  // วัตถุดิบ (ถาด + ชิ้นเดี่ยวในชาม)
  bokTray: "Asset/Bok_choy_Tray.png", // *มีเว้นวรรคก่อน .png ตามชื่อไฟล์จริงของคุณ
  bokPiece: "Asset/Bok_choy_Single.png",

  cabTray: "Asset/Cabbage_Tray.png",
  cabPiece: "Asset/Cabbage_Single.png",

  watTray: "Asset/Water_spinach_Tray.png",
  watPiece: "Asset/Water_spinach_Scattered.png",

  wakTray: "Asset/Wakame_Tray.png",
  wakPiece: "Asset/Wakame_Bunch.png",

  enokiTray: "Asset/Enoki_Tray.png",
  enokiPiece: "Asset/Enoki_portion.png",

  oysterTray: "Asset/King_oyster_mushroom_Tray.png",
  oysterPiece: "Asset/King_oyster_mushroom_Slice.png",

  lotusTray: "Asset/Lotus_root_Tray.png",
  lotusPiece: "Asset/Lotus_root_Slice.png",

  cornTray: "Asset/Baby_corn_Tray.png",
  cornPiece: "Asset/Baby_corn_Bunch.png",

  beefTray: "Asset/Sliced_beef_Tray.png",
  beefPiece: "Asset/Sliced_beef_Single.png",
  beefRipe: "Asset/Sliced_beef_Single_Ripe.png",

  bellyTray: "Asset/Sliced_pork_belly_Tray.png",
  bellyPiece: "Asset/Sliced_pokr_belly_Single.png", // *สะกด pokr ตามชื่อไฟล์จริงของคุณ
  bellyRipe: "Asset/Sliced_pokr_belly_Single_Ripe.png",

  collarTray: "Asset/Pork_collar_Tray.png",
  collarPiece: "Asset/Pork_Collar_Sliced_Single.png",
  collarRipe: "Asset/Pork_Collar_Sliced_Single_Ripe.png",

  sausTray: "Asset/Cocktail_sausage_Tray.png",
  sausPiece: "Asset/Cocktail_sausage_Single.png",

  cheeseTray: "Asset/Cheese_tofu_Tray.png",
  cheesePiece: "Asset/Cheese_tofu_Single.png",

  rollTray: "Asset/Fried_tofu_curd_roll_Tray.png",
  rollPiece: "Asset/Fried_tofu_curd_roll_Single.png",

  jellyTray: "Asset/Jellyfish_Tray.png",
  jellyPiece: "Asset/Jellyfish_Scattered.png",

  kelpTray: "Asset/Kelp_noodles_Tray.png",
  kelpPiece: "Asset/Kelp_noodles_Bunch.png",

  glassTray: "Asset/Glass_noodles_Tray.png",
  glassPiece: "Asset/Glass_noodles_Bunch.png",

  instTray: "Asset/Instant_noodles_Tray.png",
  instPiece: "Asset/Instant_noodles_Bunch.png",

  sweetTray: "Asset/Sweet_potato_noodles_Tray.png",
  sweetPiece: "Asset/Sweet_potato_noodles_Bunch.png",
};


const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Load icon libraries
const MaterialIcons = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json');
const MaterialCommunityIcons = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json');
const FontAwesome5 = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome5Free.json');
const Ionicons = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Ionicons.json');
const Feather = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Feather.json');
const AntDesign = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/AntDesign.json');
const Entypo = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Entypo.json');
const EvilIcons = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/EvilIcons.json');
const Foundation = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Foundation.json');
const Octicons = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Octicons.json');
const SimpleLineIcons = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/SimpleLineIcons.json');
const Zocial = require('@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/Zocial.json');

const libraries = {
  MaterialIcons: Object.keys(MaterialIcons),
  MaterialCommunityIcons: Object.keys(MaterialCommunityIcons),
  FontAwesome5: Object.keys(FontAwesome5),
  Ionicons: Object.keys(Ionicons),
  Feather: Object.keys(Feather),
  AntDesign: Object.keys(AntDesign),
  Entypo: Object.keys(Entypo),
  EvilIcons: Object.keys(EvilIcons),
  Foundation: Object.keys(Foundation),
  Octicons: Object.keys(Octicons),
  SimpleLineIcons: Object.keys(SimpleLineIcons),
  Zocial: Object.keys(Zocial),
};

// Regex patterns
const patterns = [
  { lib: 'MaterialIcons', regex: /android_material_icon_name=["']([^"']+)["']/g },
  { lib: 'MaterialIcons', regex: /<MaterialIcons[^>]*name=["']([^"']+)["']/g },
  { lib: 'MaterialCommunityIcons', regex: /<MaterialCommunityIcons[^>]*name=["']([^"']+)["']/g },
  { lib: 'MaterialCommunityIcons', regex: /iconLibrary=["']MaterialCommunityIcons["'][^>]*iconName=["']([^"']+)["']/g },
  { lib: 'FontAwesome5', regex: /<FontAwesome5[^>]*name=["']([^"']+)["']/g },
  { lib: 'FontAwesome5', regex: /iconLibrary=["']FontAwesome5["'][^>]*iconName=["']([^"']+)["']/g },
  { lib: 'Ionicons', regex: /<Ionicons[^>]*name=["']([^"']+)["']/g },
  { lib: 'Feather', regex: /<Feather[^>]*name=["']([^"']+)["']/g },
  { lib: 'AntDesign', regex: /<AntDesign[^>]*name=["']([^"']+)["']/g },
  { lib: 'Entypo', regex: /<Entypo[^>]*name=["']([^"']+)["']/g },
];

const files = glob.sync('**/*.{tsx,ts,jsx,js}', { ignore: 'node_modules/**' });

let issues = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  patterns.forEach(({ lib, regex }) => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const iconName = match[1];
      // Skip dynamic expressions
      if (iconName.includes('{') || iconName.includes('$') || iconName.includes('?')) continue;
      
      if (!libraries[lib].includes(iconName)) {
        issues.push({
          file,
          library: lib,
          icon: iconName
        });
      }
    }
  });
});

console.log(JSON.stringify(issues, null, 2));

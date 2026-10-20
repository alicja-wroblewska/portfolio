// przykładowy src/js/data.js
import baletnicaImg from '../assets/Fotomontaz/Baletnica.png';
import elfImg from '../assets/Ilustracje/Elf.png';
import czarownicaImg from '../assets/Ilustracje/Czarownica.png';
import logoZorika from '../assets/Logo/Logo_Kino_Zorika.png';
import pasjaImg from '../assets/Logo/Pasja_malowane.png';
import pierogiImg from '../assets/Plakaty/Kiermasz_pierogow.png';
import linoryt1Img from '../assets/Plakaty/Warsztaty_linorytu.png';
import linoryt2Img from '../assets/Plakaty/Warsztaty_linorytu2.png';
import jarmarkVid from '../assets/Rolki/Jarmark_Bozonarodzeniowy.mp4';

export const DATA = [
  {
    n: 'Fotomontaż',
    a: '4/3',
    h: '#3fb6c9, #1d4e89',
    items: [
      { t: 'Kompozycja Surrealistyczna (Baletnica)', src: baletnicaImg, desc: 'Fotomontaż cyfrowy, Adobe Photoshop, 2024' }
    ]
  },
  {
    n: 'Ilustracje',
    a: '1/1',
    h: '#f4a261, #e76f51',
    items: [
      { t: 'Vector Character Art - Elf', src: elfImg, desc: 'Ilustracja wektorowa (Adobe Illustrator)' },
      { t: 'Ilustracja Książkowa - Czarownica', src: czarownicaImg, desc: 'Ilustracja wektorowa (Adobe Illustrator)' }
    ]
  },
  {
    n: 'Logo & Branding',
    a: '1/1',
    h: '#8d99ae, #2b2d42',
    items: [
      { t: 'Kino Zorika', src: logoZorika, desc: 'Znak graficzny i branding' },
      { t: 'Pasja Malowane', src: pasjaImg, desc: 'Projekt logotypu i identyfikacja wizualna' }
    ]
  },
  {
    n: 'Plakaty',
    a: '3/4',
    h: '#ef476f, #6a4c93',
    items: [
      { t: 'Kiermasz Pierogów', src: pierogiImg, desc: 'Plakat promocyjny' },
      { t: 'Warsztaty Linorytu I', src: linoryt1Img, desc: 'Plakat kulturalny' },
      { t: 'Warsztaty Linorytu II', src: linoryt2Img, desc: 'Seria plakatów warsztatowych' }
    ]
  },
  {
    n: 'Rolki & Video',
    a: '9/16',
    h: '#06d6a0, #118ab2',
    video: true,
    items: [
      { t: 'Jarmark Bożonarodzeniowy', src: jarmarkVid, desc: 'Montaż wideo na potrzeby Instagram / TikTok' }
    ]
  }
];
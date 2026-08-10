"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { API_BASE_URL } from "@/config/api";
import RetreatsTab from "./RetreatsTab";
import EnquiriesTab from "./EnquiriesTab";
import {
  LayoutDashboard,
  Home,
  FileText,
  Bed,
  Settings,
  Users,
  Compass,
  Smile,
  HelpCircle,
  ExternalLink,
  Bell,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit2,
  MoreVertical,
  LogOut,
  FolderOpen,
  Calendar,
  MessageSquare,
  Activity,
  Globe,
  Database,
  CloudLightning,
  Sparkles,
  X,
  Upload,
  Check,
  Trash2,
  Loader2,
  MapPin,
  Clock,
  ListPlus,
  Sliders,
  DollarSign,
  Mail,
  Camera
} from "lucide-react";

interface LocalizedText {
  en: string;
  de: string;
  fr: string;
  ru: string;
}

const DEFAULT_HOST_RETREAT_CONFIG = {
  // Rooms
  rooms: [
    {
      id: "room-101",
      phase: 1,
      number: "101",
      ac: false,
      category: {
        en: "Double Room Ground Floor",
        de: "Doppelzimmer Erdgeschoss",
        fr: "Chambre Double Rez-de-Chaussée",
        ru: "Двухместный Номер на Первом Этаже"
      },
      balcony: {
        en: "No (garden-view window)",
        de: "Nein (Gartenblick-Fenster)",
        fr: "Non (fenêtre vue jardin)",
        ru: "Нет (окно с видом на сад)"
      },
      beds: {
        en: "1 large bed (6 ft × 6 ft) or 2 single beds",
        de: "1 großes Bett (180x180 cm) oder 2 Einzelbetten",
        fr: "1 grand lit (180x180 cm) ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Type",
        de: "Geschlossener Typ",
        fr: "Type Fermé",
        ru: "Закрытый Тип"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser system (direct shower)",
        de: "Geysersystem (direkte Dusche)",
        fr: "Système de chauffe-eau (douche directe)",
        ru: "Бойлерная система (прямой душ)"
      },
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-102",
      phase: 1,
      number: "102",
      ac: false,
      category: {
        en: "Double Room Ground Floor",
        de: "Doppelzimmer Erdgeschoss",
        fr: "Chambre Double Rez-de-Chaussée",
        ru: "Двухместный Номер на Первом Этаже"
      },
      balcony: {
        en: "Small private balcony",
        de: "Kleiner privater Balkon",
        fr: "Petit balcon privé",
        ru: "Небольшой собственный балкон"
      },
      beds: {
        en: "1 large bed (6 ft × 6 ft) or 2 single beds",
        de: "1 großes Bett (180x180 cm) oder 2 Einzelbetten",
        fr: "1 grand lit (180x180 cm) ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Not available",
        de: "Nicht verfügbar",
        fr: "Non disponible",
        ru: "Недоступно"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser system (direct shower)",
        de: "Geysersystem (direkte Dusche)",
        fr: "Système de chauffe-eau (douche directe)",
        ru: "Бойлерная система (прямой душ)"
      },
      images: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-103",
      phase: 1,
      number: "103",
      ac: false,
      category: {
        en: "Deluxe Room With Balcony",
        de: "Deluxe-Zimmer mit Balkon",
        fr: "Chambre Deluxe avec Balcon",
        ru: "Номер Делюкс с Балконом"
      },
      balcony: {
        en: "Yes",
        de: "Ja",
        fr: "Oui",
        ru: "Да"
      },
      beds: {
        en: "1 large bed (6 ft × 6 ft) or 2 single beds",
        de: "1 großes Bett (180x180 cm) oder 2 Einzelbetten",
        fr: "1 grand lit (180x180 cm) ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Type",
        de: "Geschlossener Typ",
        fr: "Type Fermé",
        ru: "Закрытый Тип"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser system (direct shower)",
        de: "Geysersystem (direkte Dusche)",
        fr: "Système de chauffe-eau (douche directe)",
        ru: "Бойлерная система (прямой душ)"
      },
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-104",
      phase: 1,
      number: "104",
      ac: false,
      category: {
        en: "Deluxe Room With Balcony",
        de: "Deluxe-Zimmer mit Balkon",
        fr: "Chambre Deluxe avec Balcon",
        ru: "Номер Делюкс с Балконом"
      },
      balcony: {
        en: "Yes",
        de: "Ja",
        fr: "Oui",
        ru: "Да"
      },
      beds: {
        en: "1 large bed (6 ft × 6 ft) or 2 single beds",
        de: "1 großes Bett (180x180 cm) oder 2 Einzelbetten",
        fr: "1 grand lit (180x180 cm) ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Open Type",
        de: "Offener Typ",
        fr: "Type Ouvert",
        ru: "Открытый Тип"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser system (direct shower)",
        de: "Geysersystem (direkte Dusche)",
        fr: "Système de chauffe-eau (douche directe)",
        ru: "Бойлерная система (прямой душ)"
      },
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-105",
      phase: 2,
      number: "105",
      ac: true,
      category: {
        en: "Standard Room",
        de: "Standardzimmer",
        fr: "Chambre Standard",
        ru: "Стандартный Номер"
      },
      balcony: {
        en: "No",
        de: "Nein",
        fr: "Non",
        ru: "Нет"
      },
      beds: {
        en: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)",
        de: "1 großes Bett oder 2 Einzelbetten",
        fr: "1 grand lit ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Wardrobe",
        de: "Geschlossener Kleiderschrank",
        fr: "Armoire Fermée",
        ru: "Закрытый Шкаф"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser System",
        de: "Geysersystem",
        fr: "Système de chauffe-eau",
        ru: "Бойлерная Система"
      },
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-106",
      phase: 2,
      number: "106",
      ac: true,
      category: {
        en: "Standard Room (Teacher/Single)",
        de: "Standardzimmer (Lehrer/Einzelzimmer)",
        fr: "Chambre Standard (Enseignant/Simple)",
        ru: "Стандартный Номер (Преподаватель/Одноместный)"
      },
      balcony: {
        en: "No",
        de: "Nein",
        fr: "Non",
        ru: "Нет"
      },
      beds: {
        en: "Single Large Bed (Non-Separable)",
        de: "Einzelnes großes Bett (nicht trennbar)",
        fr: "Grand lit simple (non séparable)",
        ru: "Одна большая кровать (нераздельная)"
      },
      wardrobe: {
        en: "Closed Wardrobe",
        de: "Geschlossener Kleiderschrank",
        fr: "Armoire Fermée",
        ru: "Закрытый Шкаф"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser System",
        de: "Geysersystem",
        fr: "Système de chauffe-eau",
        ru: "Бойлерная Система"
      },
      notes: {
        en: "Recommended for Teacher Accommodation or Single Occupancy",
        de: "Empfohlen für Lehrer oder Einzelbelegung",
        fr: "Recommandé pour enseignant ou occupation simple",
        ru: "Рекомендуется для размещения преподавателя или одноместного размещения"
      },
      images: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-107",
      phase: 2,
      number: "107",
      ac: true,
      category: {
        en: "Standard Room",
        de: "Standardzimmer",
        fr: "Chambre Standard",
        ru: "Стандартный Номер"
      },
      balcony: {
        en: "No",
        de: "Nein",
        fr: "Non",
        ru: "Нет"
      },
      beds: {
        en: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)",
        de: "1 großes Bett oder 2 Einzelbetten",
        fr: "1 grand lit ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Wardrobe",
        de: "Geschlossener Kleiderschrank",
        fr: "Armoire Fermée",
        ru: "Закрытый Шкаф"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser System",
        de: "Geysersystem",
        fr: "Système de chauffe-eau",
        ru: "Бойлерная Система"
      },
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-108",
      phase: 2,
      number: "108",
      ac: true,
      category: {
        en: "Deluxe Room",
        de: "Deluxe-Zimmer",
        fr: "Chambre Deluxe",
        ru: "Номер Делюкс"
      },
      balcony: {
        en: "No",
        de: "Nein",
        fr: "Non",
        ru: "Нет"
      },
      beds: {
        en: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)",
        de: "1 großes Bett oder 2 Einzelbetten",
        fr: "1 grand lit ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Wardrobe",
        de: "Geschlossener Kleiderschrank",
        fr: "Armoire Fermée",
        ru: "Закрытый Шкаф"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser System",
        de: "Geysersystem",
        fr: "Système de chauffe-eau",
        ru: "Бойлерная Система"
      },
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-109",
      phase: 2,
      number: "109",
      ac: true,
      category: {
        en: "Deluxe Room with Balcony",
        de: "Deluxe-Zimmer mit Balkon",
        fr: "Chambre Deluxe avec Balcon",
        ru: "Номер Делюкс с Балконом"
      },
      balcony: {
        en: "Private Balcony",
        de: "Privater Balkon",
        fr: "Balcon Privé",
        ru: "Собственный Балкон"
      },
      beds: {
        en: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)",
        de: "1 großes Bett oder 2 Einzelbetten",
        fr: "1 grand lit ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Wardrobe",
        de: "Geschlossener Kleiderschrank",
        fr: "Armoire Fermée",
        ru: "Закрытый Шкаф"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser System",
        de: "Geysersystem",
        fr: "Système de chauffe-eau",
        ru: "Бойлерная Система"
      },
      images: [
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600"
      ]
    },
    {
      id: "room-110",
      phase: 2,
      number: "110",
      ac: true,
      category: {
        en: "Deluxe Room",
        de: "Deluxe-Zimmer",
        fr: "Chambre Deluxe",
        ru: "Номер Делюкс"
      },
      balcony: {
        en: "No",
        de: "Nein",
        fr: "Non",
        ru: "Нет"
      },
      beds: {
        en: "1 Large Bed (6 ft × 6 ft) or 2 Single Beds (6 ft × 3 ft each)",
        de: "1 großes Bett oder 2 Einzelbetten",
        fr: "1 grand lit ou 2 lits simples",
        ru: "1 большая кровать или 2 односпальные кровати"
      },
      wardrobe: {
        en: "Closed Wardrobe",
        de: "Geschlossener Kleiderschrank",
        fr: "Armoire Fermée",
        ru: "Закрытый Шкаф"
      },
      bathroom: {
        en: "Attached",
        de: "Angeschlossen",
        fr: "Attenante",
        ru: "Примыкающая"
      },
      hotWater: {
        en: "Geyser System",
        de: "Geysersystem",
        fr: "Système de chauffe-eau",
        ru: "Бойлерная  Система"
      },
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=600"
      ]
    }
  ],

  // Meal Titles
  noMealsOption: {
    en: "No Meal Catering (Self Catering)",
    de: "Keine Verpflegung (Selbstverpflegung)",
    fr: "Sans Restauration (Gestion Libre)",
    ru: "Без Питания (Самообслуживание)"
  },
  breakfastOnlyOption: {
    en: "Breakfast Package Only",
    de: "Nur Frühstückspaket",
    fr: "Forfait Petit-Déjeuner Uniquement",
    ru: "Только Пакет Завтраков"
  },
  fullDayOption: {
    en: "Full Day Vegetarian Menu (Breakfast + Lunch + Dinner)",
    de: "Vollpension Vegetarisches Menü (Frühstück + Mittagessen + Abendessen)",
    fr: "Menu Végétarien Pension Complète (Petit-Déjeuner + Déjeuner + Dîner)",
    ru: "Вегетарианское Меню на Весь День (Завтрак + Обед + Ужин)"
  },

  // Meals & Menus
  menuBreakfastItems: {
    en: "Fresh Fruit Juices, Ayurvedic Porridge, Traditional Idli & Dosa, Herbal Infusions",
    de: "Frische Fruchtsäfte, Ayurvedischer Brei, Traditionelle Idli & Dosa, Kräutertees",
    fr: "Jus de fruits frais, Porridge ayurvédique, Idli & Dosa traditionnels, Infusions aux herbes",
    ru: "Свежие Фруктовые Соки, Аюрведическая Каша, Традиционные Идли и Доса, Травяные Настои"
  },
  menuLunchItems: {
    en: "Kerala Sadhya on Banana Leaf, Organic Brown Rice, Coconut Curry, Local Seasonal Vegetables",
    de: "Kerala Sadhya auf Bananenblatt, Bio-Naturreis, Kokosnuss-Curry, Lokales Gemüse der Saison",
    fr: "Kerala Sadhya sur feuille de bananier, Riz complet bio, Curry de noix de coco, Légumes locaux de saison",
    ru: "Керала Садхья на Банановом Листе, Органический Коричневый Рис, Кокосовый Карри, Местные Сезонные Овощи"
  },
  menuDinnerItems: {
    en: "Light Vegetable Soup, Grilled Paneer with Herbs, Chapatis, Steamed Broccoli & Carrots",
    de: "Leichte Gemüsesuppe, Gegrillter Paneer mit Kräutern, Chapatis, Gedämpfter Brokkoli & Karotten",
    fr: "Soupe légère aux légumes, Paneer grillé aux herbes, Chapatis, Brocoli & Carottes à la vapeur",
    ru: "Легкий Овощной Суп, Гриль Панир с Травами, Чапати, Брокколи и Морковь на Пару"
  },
  menuFooterItems: {
    en: "Gluten-free, Lactose-free, Vegan options on request",
    de: "Glutenfrei, Laktosefrei, Vegane Optionen auf Anfrage",
    fr: "Options sans gluten, sans lactose, végétaliennes sur demande",
    ru: "Безглютеновые, безлактозные, веганские варианты по запросу"
  },

  // Logistics
  yogaHallUsageTitle: {
    en: "Yoga Hall & Sessions Details",
    de: "Yoga-Halle & Details zu den Sitzungen",
    fr: "Salle de Yoga & Détails des Séances",
    ru: "Детали Йога-Зала и Занятий"
  },
  yogaHallSessionsLabel: {
    en: "Retreat Yoga Sessions per Day (Rooftop Sala Included)",
    de: "Yoga-Sitzungen pro Tag (Dach-Sala inklusive)",
    fr: "Séances de yoga de retraite par jour (Rooftop Sala inclus)",
    ru: "Занятий Йогой в День (Включая Зал на Крыше)"
  },
  trivandrumAirport: {
    en: "Trivandrum Airport (TRV) Transfers",
    de: "Transfers vom Flughafen Trivandrum (TRV)",
    fr: "Transferts de l'aéroport de Trivandrum (TRV)",
    ru: "Трансфер из Аэропорта Тривандрам (TRV)"
  },
  carSmallLabel: {
    en: "Sedan (Etios/Dzire) - Max 3 guests",
    de: "Limousine (Etios/Dzire) - Max. 3 Gäste",
    fr: "Berline (Etios/Dzire) - Max 3 personnes",
    ru: "Седан (Etios/Dzire) - Макс 3 гостя"
  },
  carLargeLabel: {
    en: "SUV (Innova) - Max 5 guests",
    de: "SUV (Innova) - Max. 5 Gäste",
    fr: "SUV (Innova) - Max 5 personnes",
    ru: "Внедорожник (Innova) - Макс 5 гостей"
  },
  tempoLabel: {
    en: "Tempo Traveller - Max 12-15 guests",
    de: "Tempo-Reisebus - Max. 12-15 Gäste",
    fr: "Tempo Traveller - Max 12-15 personnes",
    ru: "Tempo Traveller - Макс 12-15 гостей"
  },

  // Highlight Features
  roomsFeatureTitle: {
    en: "10 Air-Conditioned Rooms",
    de: "10 Klimatisierte Zimmer",
    fr: "10 Chambres Climatisées",
    ru: "10 Номеров с Кондиционером"
  },
  roomsFeatureDesc: {
    en: "Distributed across two adjacent phases. Offers comfortable options ranging from standard ground-floor units to premium deluxe rooms with private balconies.",
    de: "Verteilt auf zwei benachbarte Phasen. Bietet komfortable Optionen von Standard-Erdgeschoss-Einheiten bis hin zu Premium-Deluxe-Zimmern mit privatem Balkon.",
    fr: "Réparties sur deux phases adjacentes. Offre des options confortables allant des unités standard au rez-de-chaussée aux chambres de luxe premium avec balcon privé.",
    ru: "Распределено по двум соседним фазам. Предлагает комфортабельные варианты размещения от стандартных номеров на первом этаже до номеров делюкс премиум-класса с собственным балконом."
  },
  hallFeatureTitle: {
    en: "Rooftop Yoga Sala",
    de: "Yoga-Sala auf dem Dach",
    fr: "Rooftop Yoga Sala",
    ru: "Зал для Йоги на Крыше"
  },
  hallFeatureDesc: {
    en: "Shared rooftop studio equipped with yoga mats, blocks, natural fresh air, and excellent natural lighting. Holds a capacity of 15 to 18 participants.",
    de: "Gemeinsames Studio auf dem Dach, ausgestattet mit Yogamatten, Blöcken, natürlicher Frischluft und hervorragendem Tageslicht. Bietet Platz für 15 bis 18 Teilnehmer.",
    fr: "Studio partagé sur le toit équipé de tapis de yoga, de briques, d'air frais naturel et d'un excellent éclairage naturel. Capacité de 15 à 18 participants.",
    ru: "Общая студия на крыше, оборудованная ковриками для йоги, опорными блоками, со свежим воздухом и отличным естественным освещением. Вмещает от 15 до 18 участников."
  },
  mealsFeatureTitle: {
    en: "Customized Homely Meals",
    de: "Individuelle Hausmannskost",
    fr: "Repas Maison Personnalisés",
    ru: "Индивидуальное Домашнее Питание"
  },
  mealsFeatureDesc: {
    en: "Homestyle vegetarian, vegan, and gluten-free menus cooked fresh. Flexible meal options, including full day packages and customizable retreat group menus.",
    de: "Hausgemachte vegetarische, vegane und glutenfreie Menüs, frisch zubereitet. Flexible Verpflegungsoptionen, einschließlich Ganztagspaketen und anpassbaren Retreat-Gruppenmenüs.",
    fr: "Menus maison végétariens, végétaliens et sans gluten préparés à la demande. Options de repas flexibles, y compris des forfaits journée complète et des menus de groupe de retraite personnalisables.",
    ru: "Домашнее вегетарианское, веганское и безглютеновое меню, приготовленное из свежих продуктов. Гибкие варианты питания, включая пакеты услуг на весь день и настраиваемые меню для групп."
  },

  // Booking terms
  termsTitle: {
    en: "Booking Terms & Conditions",
    de: "Buchungsbedingungen",
    fr: "Conditions Générales de Réservation",
    ru: "Правила и Условия Бронирования"
  },
  confirmationTitle: {
    en: "Booking Confirmation",
    de: "Buchungsbestätigung",
    fr: "Confirmation de Réservation",
    ru: "Подтверждение Бронирования"
  },
  confirmationRule1: {
    en: "Booking confirmation will be provided only upon receipt of the required advance payment.",
    de: "Die Buchungsbestätigung erfolgt erst nach Erhalt der erforderlichen Anzahlung.",
    fr: "La confirmation de la réservation ne sera fournie qu'après réception de l'acompte requis.",
    ru: "Подтверждение бронирования предоставляется только после получения необходимой предоплаты."
  },
  confirmationRule2: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  confirmationRule3: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  paymentTermsTitle: {
    en: "Payment Terms",
    de: "Zahlungsbedingungen",
    fr: "Conditions de Paiement",
    ru: "Условия Оплаты"
  },
  paymentTermsRule1: {
    en: "The balance amount, if any, must be settled before or upon check-in, as agreed at the time of booking.",
    de: "Der Restbetrag muss vor oder bei dem Check-in beglichen werden, wie bei der Buchung vereinbart.",
    fr: "Le solde, le cas échéant, doit être réglé avant ou lors de l'enregistrement, comme convenu lors de la réservation.",
    ru: "Оставшаяся сумма, если таковая имеется, должна быть выплачена до или во время регистрации, как былосогласовано при бронировании."
  },
  paymentTermsRule2: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  paymentTermsRule3: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  paymentTermsRule4: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  termsAndCondTitle: {
    en: "Terms & Conditions",
    de: "Allgemeine Geschäftsbedingungen",
    fr: "Conditions Générales",
    ru: "Правила и Условия"
  },
  termsRule1: {
    en: "The above rates are valid for stays during the month of November.",
    de: "Die oben genannten Preise gelten für Aufenthalte im November.",
    fr: "Les tarifs ci-dessus sont valables pour les séjours durant le mois de novembre.",
    ru: "Вышеуказанные тарифы действительны для проживания в течение ноября."
  },
  termsRule2: {
    en: "All rates are inclusive of applicable GST.",
    de: "Alle Preise verstehen sich inklusive der geltenden GST-Steuer.",
    fr: "Tous les tarifs incluent la taxe GST applicable.",
    ru: "Все тарифы включают применимый налог GST."
  },
  termsRule3: {
    en: "All reservations are subject to room availability at the time of booking.",
    de: "Alle Reservierungen unterliegen der Zimmerverfügbarkeit zum Zeitpunkt der Buchung.",
    fr: "Toutes les réservations sont soumises à la disponibilité des chambres au moment de la réservation.",
    ru: "Все бронирования зависят от наличия свободных номеров на момент бронирования."
  },
  termsRule4: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  termsRule5: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  termsRule6: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  termsRule7: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },

  // Cancellation policies
  cancellationTitle: {
    en: "Cancellation Policy",
    de: "Stornierungsbedingungen",
    fr: "Politique d'Annulation",
    ru: "Правила Отмены"
  },
  cancel60Days: {
    en: "Cancellations made 30 days or more before the check-in date",
    de: "Stornierungen ab 30 Tage vor dem Anreisedatum",
    fr: "Annulations effectuées 30 jours ou plus avant la date d'arrivée",
    ru: "Отмена бронирования за 30 дней и более до даты заезда"
  },
  cancel60DaysDesc: {
    en: "Eligible for a full refund of the advance payment.",
    de: "Anspruch auf eine vollständige Rückerstattung der Anzahlung.",
    fr: "Éligible à un remboursement complet de l'acompte.",
    ru: "Право на полный возврат предоплаты."
  },
  cancel30to59: {
    en: "Cancellations made within 30 days of the check-in date",
    de: "Stornierungen innerhalb von 30 Tagen vor dem Anreisedatum",
    fr: "Annulations effectuées dans les 30 jours précédant la date d'arrivée",
    ru: "Отмена бронирования в течение 30 дней до даты заезда"
  },
  cancel30to59Desc: {
    en: "Non-refundable.",
    de: "Nicht erstattungsfähig.",
    fr: "Non remboursable.",
    ru: "Не подлежит возврату."
  },
  cancelUnder30: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  cancelUnder30Desc: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  noShow: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  noShowDesc: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  amendmentsTitle: {
    en: "Amendments",
    de: "Änderungen",
    fr: "Modifications",
    ru: "Изменения"
  },
  amendmentsRule1: {
    en: "Date changes are subject to availability and management approval.",
    de: "Terminänderungen unterliegen der Verfügbarkeit und der Genehmigung durch das Management.",
    fr: "Les modifications de dates sont soumises à disponibilité et à l'approbation de la direction.",
    ru: "Изменение дат возможно при наличии свободных мест и одобрении руководства."
  },
  amendmentsRule2: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  amendmentsRule3: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  forceMajeureTitle: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  forceMajeureDesc: {
    en: "",
    de: "",
    fr: "",
    ru: ""
  },
  footerGreeting: {
    en: "Thank you for choosing Villa Lemon Homestay. We look forward to welcoming you to Varkala and providing you with a comfortable and memorable stay.",
    de: "Vielen Dank, dass Sie sich für das Villa Lemon Homestay entschieden haben. Wir freuen uns darauf, Sie in Varkala begrüßen zu dürfen und Ihnen einen angenehmen Aufenthalt zu bieten.",
    fr: "Merci d'avoir choisi Villa Lemon Homestay. Nous nous réjouissons de vous accueillir à Varkala et de vous offrir un séjour confortable et mémorable.",
    ru: "Благодарим вас за выбор Villa Lemon Homestay. Мы с нетерпением ждем возможности приветствовать вас в Варкале и обеспечить вам комфортное и незабываемое пребывание."
  },
  footerSignature: {
    en: "SHAHID — VILLA LEMON HOMESTAY",
    de: "SHAHID — VILLA LEMON HOMESTAY",
    fr: "SHAHID — VILLA LEMON HOMESTAY",
    ru: "SHAHID — VILLA LEMON HOMESTAY"
  },

  // Experience Section
  experienceTitle: {
    en: "5+ Years",
    de: "5+ Jahre",
    fr: "5+ Ans",
    ru: "5+ Лет"
  },
  experienceStats: {
    en: "Hosting Global Retreats",
    de: "Ausrichter globaler Retreats",
    fr: "Accueil de retraites mondiales",
    ru: "Организация международных ретритов"
  },
  experienceDesc: {
    en: "We have been hosting premium yoga retreats and wellness programs for over 5 years. Our hosts have welcomed teachers and practitioners from Germany, France, the UK, Russia, and all over the world, creating a warm, inclusive community space.",
    de: "Wir veranstalten seit über 5 Jahren erstklassige Yoga-Retreats und Wellness-Programme. Unsere Gastgeber haben Lehrer und Praktizierende aus Deutschland, Frankreich, Großbritannien, Russland und der ganzen Welt willkommen geheißen und so einen warmen, integrativen Gemeinschaftsraum geschaffen.",
    fr: "Nous organisons des retraites de yoga et des programmes de bien-être haut de gamme depuis plus de 5 ans. Nos hôtes ont accueilli des enseignants et des praticiens d'Allemagne, de France, du Royaume-Uni, de Russie et du monde entier, créant ainsi un espace communautaire chaleureux et inclusif.",
    ru: "Мы проводим йога-ретриты премиум-класса и оздоровительные программы уже более 5 лет. Наши хозяева принимали преподавателей и практиков из Германии, Франции, Великобритании, России и со всего мира, создавая теплое, инклюзивное пространство для сообщества."
  },

  // Addons / Curated excursions
  addonsTitle: {
    en: "Curated Excursions & Extras",
    de: "Kurierte Ausflüge & Extras",
    fr: "Excursions et Extras sur Mesure",
    ru: "Организованные Экскурсии и Дополнительные Услуги"
  },
  addonsIntro: {
    en: "To make your retreat truly unforgettable, we offer curated local packages and excursions for your group.",
    de: "Um Ihr Retreat unvergesslich zu machen, bieten wir kuratierte lokale Pakete und Ausflüge für Ihre Gruppe an.",
    fr: "Pour rendre votre retraite inoubliable, nous proposons des forfaits locaux et des excursions sur mesure pour votre groupe.",
    ru: "Чтобы сделать ваш ретрит незабываемым, мы предлагаем специальные пакеты экскурсий для вашей группы."
  },
  addon1Title: {
    en: "Varkala Sightseeing",
    de: "Varkala Besichtigung",
    fr: "Visite de Varkala",
    ru: "Достопримечательности Варкалы"
  },
  addon1Desc: {
    en: "Explore the famous Varkala Cliffs, ancient temples, natural springs, and pristine beaches with our guided day trips.",
    de: "Erkunden Sie die berühmten Klippen von Varkala, alte Tempel, natürliche Quellen und unberührte Strände bei unseren geführten Tagesausflügen.",
    fr: "Explorez les célèbres falaises de Varkala, les temples anciens, les sources naturelles et les plages immaculées grâce à nos excursions guidées d'une journée.",
    ru: "Исследуйте знаменитые клифы Варкалы, древние храмы, природные источники и чистейшие пляжи в наших однодневных поездках с гидом."
  },
  addon2Title: {
    en: "Backwater & Mangrove Tours",
    de: "Backwater & Mangroven Touren",
    fr: "Tours des Backwaters & Mangroves",
    ru: "Туры по Заводям и Манграм"
  },
  addon2Desc: {
    en: "Paddle through tranquil mangrove forests at sunrise or enjoy a relaxing houseboat cruise in the nearby backwaters.",
    de: "Paddeln Sie bei Sonnenaufgang durch ruhige Mangrovenwälder oder genießen Sie eine entspannende Hausbootfahrt in den nahe gelegenen Backwaters.",
    fr: "Naviguez dans les forêts de mangroves paisibles au lever du soleil ou profitez d'une croisière relaxante en péniche dans les backwaters voisins.",
    ru: "Проплывите на каяке по тихим мангровым лесам на рассвете или насладитесь расслабляющим круизом на хаусботе по близлежащим заводям."
  },
  addon3Title: {
    en: "Ayurvedic Treatments",
    de: "Ayurvedische Behandlungen",
    fr: "Soins Ayurvédiques",
    ru: "Аюрведические Процедуры"
  },
  addon3Desc: {
    en: "Treat your participants to authentic Ayurvedic massages, consultations, and traditional steam bath therapies.",
    de: "Verwöhnen Sie Ihre Teilnehmer mit authentischen ayurvedischen Massagen, Konsultationen und traditionellen Dampfbadtherapien.",
    fr: "Offrez à vos participants des massages ayurvédiques authentiques, des consultations et des thérapies traditionnelles par bain de vapeur.",
    ru: "Порадуйте своих участников аутентичным аюрведическим массажем, консультациями и традиционными паровыми банями."
  },

  // FAQs
  faq1Question: {
    en: "Do you provide yoga props and mats?",
    de: "Stellen Sie Yoga-Requisiten und Matten zur Verfügung?",
    fr: "Fournissez-vous des accessoires et des tapis de yoga?",
    ru: "Предоставляете ли вы инвентарь и коврики для йоги?"
  },
  faq1Answer: {
    en: "Yes, our rooftop yoga shala is fully equipped with high-quality yoga mats, blocks, and straps, all available free of charge.",
    de: "Ja, unsere Yoga-Shala auf dem Dach ist komplett mit hochwertigen Yogamatten, Blöcken und Gurten ausgestattet, die alle kostenlos zur Verfügung stehen.",
    fr: "Oui, notre shala de yoga sur le toit est entièrement équipé de tapis de yoga, de briques et de sangles de qualité, tous disponibles gratuitement.",
    ru: "Да, наш зал для йоги на крыше полностью оборудован высококачественными ковриками, блоками и ремнями, все предоставляется бесплатно."
  },
  faq2Question: {
    en: "Can you cater to specific dietary requirements?",
    de: "Können Sie auf spezielle Ernährungsbedürfnisse eingehen?",
    fr: "Pouvez-vous vous adapter à des régimes alimentaires particuliers?",
    ru: "Можете ли вы учесть особые требования к питанию?"
  },
  faq2Answer: {
    en: "Absolutely. Our kitchen staff is trained in preparing vegan, gluten-free, dairy-free, and custom Ayurvedic meals upon request.",
    de: "Absolut. Unsere Küchenmitarbeiter sind geschult auf Anfrage vegane, glutenfreie, milchfreie und maßgeschneiderte ayurvedische Mahlzeiten zuzubereiten.",
    fr: "Absolument. Notre personnel de cuisine est formé pour préparer des repas végétaliens, sans gluten, sans produits laitiers et ayurvédiques sur demande.",
    ru: "Конечно. Наш персонал обучен приготовлению веганских, безглютеновых, безлактозных и индивидуальных аюрведических блюд по запросу."
  },
  faq3Question: {
    en: "Do you arrange airport transfers?",
    de: "Organisieren Sie Flughafentransfers?",
    fr: "Organisez-vous les transferts depuis l'aéroport?",
    ru: "Организуете ли вы трансфер из аэропорта?"
  },
  faq3Answer: {
    en: "Yes, we can arrange reliable transfers from Trivandrum International Airport (TRV) using Sedans, SUVs, or Tempo Travellers.",
    de: "Ja, wir können zuverlässige Transfers vom Trivandrum International Airport (TRV) mit Limousinen, SUVs oder Tempo-Reisebussen organisieren.",
    fr: "Oui, nous pouvons organiser des transferts fiables depuis l'aéroport de Trivandrum (TRV) en berline, SUV ou Tempo Traveller.",
    ru: "Да, мы можем организовать надежный трансфер из международного аэропорта Тривандрам (TRV) на седанах, внедорожниках или автобусах."
  },
  faq4Question: {
    en: "Is there a minimum group size to book?",
    de: "Gibt es eine Mindestgruppengröße für die Buchung?",
    fr: "Y a-t-il une taille minimale de groupe pour réserver?",
    ru: "Есть ли минимальный размер группы для бронирования?"
  },
  faq4Answer: {
    en: "We accommodate both small intimate groups and larger retreats of up to 18-20 participants depending on room configurations.",
    de: "Wir bieten Platz für kleine, intime Gruppen sowie für größere Retreats mit bis zu 18–20 Teilnehmern, je nach Zimmerkonfiguration.",
    fr: "Nous accueillons aussi bien de petits groupes intimes que des retraites plus importantes allant jusqu'à 18-20 participants selon la configuration des chambres.",
    ru: "Мы принимаем как небольшие группы, так и крупные ретриты до 18-20 участников в зависимости от конфигурации номеров."
  }
};

// ------------------------------------------------------------------
// DATA INTERFACES
// ------------------------------------------------------------------
interface HomepageData {
  hero: {
    tagline: LocalizedText;
    headingPart1: LocalizedText;
    headingPart2: LocalizedText;
    nature: LocalizedText;
    description: LocalizedText;
    bookStay: LocalizedText;
    whatsappBooking: LocalizedText;
  };
  about: {
    tagline: LocalizedText;
    heading: LocalizedText;
    paragraph1: LocalizedText;
    paragraph2: LocalizedText;
    button: LocalizedText;
    natureTitle: LocalizedText;
    natureDesc: LocalizedText;
    luxuryTitle: LocalizedText;
    luxuryDesc: LocalizedText;
    serviceTitle: LocalizedText;
    serviceDesc: LocalizedText;
    everyoneTitle: LocalizedText;
    everyoneDesc: LocalizedText;
    quoteText: LocalizedText;
    quoteAuthor: LocalizedText;
    statsVillasLabel: LocalizedText;
    statsGuestsLabel: LocalizedText;
    statsRatingLabel: LocalizedText;
    statsLocationLabel: LocalizedText;
  };
  contact?: {
    address: string;
    phone: string;
    whatsapp: string;
    email: string;
    receptionHours: string;
    googleMapsLink?: string;
  };
}

// Subgroups / Categories
interface AccommodationCategoryData {
  _id: string;
  type: "villa" | "floor" | "room";
  title: LocalizedText;
  description: LocalizedText;
  price: LocalizedText;
  image: string;
  images?: string[];
  explore: LocalizedText;
  href: string;
  template?: string;
}

interface PackageCategoryData {
  _id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  images?: string[];
  explore: LocalizedText;
  href: string;
  template?: string;
}

interface YogaCategoryData {
  _id: string;
  type: string;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  images?: string[];
  explore: LocalizedText;
  href: string;
  template?: string;
}

// Items inside subgroups
interface AccommodationItemData {
  _id: string;
  accommodationType: "villa" | "floor" | "room";
  title: LocalizedText;
  slug: string;
  price: number;
  pricePeriod: LocalizedText;
  image: string;
  images?: string[];
  aboutImage: string;
  aboutImages?: string[];
  bedrooms: number;
  bathrooms: number;
  guests: number;
  location: LocalizedText;
  shortDescription: LocalizedText;
  tagline: LocalizedText;
  aboutText1: LocalizedText;
  aboutText2: LocalizedText;
  perfectLocationText: LocalizedText;
  groupAccommodationText: LocalizedText;
  checkInTime: string;
  checkOutTime: string;
  highlights: { icon: string; label: LocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: LocalizedText; desc: LocalizedText }[];
  distances: { place: LocalizedText; distance: LocalizedText }[];
  roomAmenities: LocalizedText[];
  idealFor: LocalizedText[];
  checkInOutRules: LocalizedText[];
  additionalServices: { service: LocalizedText; details: LocalizedText }[];
  mapLink?: string;
  gallery?: string[];
  relatedAccommodations?: string[];
  badgeText?: LocalizedText;
  hideRate?: boolean;
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;
  keywords?: LocalizedText;
  ogImage?: string;
  canonicalUrl?: string;
  notes?: LocalizedText;
}

interface PackageItemData {
  _id: string;
  packageCategory: ("varkalaSightseeing" | "dayTrips" | "backwaterExperiences" | "adventureActivities" | "varkalaPackages")[];
  title: LocalizedText;
  slug: string;
  price: number;
  pricePeriod: LocalizedText;
  image: string;
  images?: string[];
  aboutImage: string;
  aboutImages?: string[];
  duration: LocalizedText;
  shortDescription: LocalizedText;
  tagline: LocalizedText;
  aboutText: LocalizedText;
  itinerary: { timeOrDay: LocalizedText; activity: LocalizedText; desc: LocalizedText }[];
  itineraryEvening?: { timeOrDay: LocalizedText; activity: LocalizedText; desc: LocalizedText }[];
  inclusions: LocalizedText[];
  exclusions: LocalizedText[];
  highlights: { icon: string; label: LocalizedText }[];
  whyGuestsLoveUs: { icon: string; title: LocalizedText; desc: LocalizedText }[];
  
  // General Info
  travelTime?: LocalizedText;
  entryFee?: LocalizedText;
  optionalCharges?: LocalizedText;
  difficulty?: LocalizedText;
  groupSize?: LocalizedText;
  location?: LocalizedText;

  // Localized Content
  tourOverview?: LocalizedText;
  bestTime?: LocalizedText;
  dressCode?: LocalizedText;
  cta?: LocalizedText;

  // Images & Media
  gallery?: string[];
  video?: string;

  // Structural lists
  quickFacts?: { key: LocalizedText; value: LocalizedText }[];
  thingsToBring?: LocalizedText[];
  nearbyAttractions?: { name: LocalizedText; distance: LocalizedText }[];
  relatedPackages?: string[];
  faqs?: { question: LocalizedText; answer: LocalizedText }[];

  // SEO
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;
  keywords?: LocalizedText;
  ogImage?: string;
  canonicalUrl?: string;

  // Booking Info
  cancellation?: LocalizedText;
  refund?: LocalizedText;
  pickup?: LocalizedText;
  drop?: LocalizedText;
  notes?: LocalizedText;
  hideRate?: boolean;
  badgeText?: LocalizedText;
}

interface YogaItemData {
  _id: string;
  yogaType: string;
  title: LocalizedText;
  slug: string;
  price: number;
  pricePeriod: LocalizedText;
  image: string;
  images?: string[];
  aboutImage: string;
  aboutImages?: string[];
  duration: LocalizedText;
  shortDescription: LocalizedText;
  tagline: LocalizedText;
  aboutText: LocalizedText;
  schedule: { time: LocalizedText; activity: LocalizedText }[];
  benefits: LocalizedText[];
  inclusions: LocalizedText[];
  relatedYoga?: string[];
  hideRate?: boolean;
  metaTitle?: LocalizedText;
  metaDescription?: LocalizedText;
  keywords?: LocalizedText;
  ogImage?: string;
  canonicalUrl?: string;
}

interface TeacherData {
  _id: string;
  name: string;
  role: LocalizedText;
  bio: LocalizedText;
  image: string;
}

type TabType = "dashboard" | "stays" | "packages" | "yoga" | "retreats" | "teachers" | "homepage" | "enquiries" | "gallery";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // LISTS STATES
  const [loading, setLoading] = useState(true);
  
  // Categories (Subgroups)
  const [accommodationCategories, setAccommodationCategories] = useState<AccommodationCategoryData[]>([]);
  const [packageCategories, setPackageCategories] = useState<PackageCategoryData[]>([]);
  const [yogaCategories, setYogaCategories] = useState<YogaCategoryData[]>([]);
  
  // Items inside categories
  const [stays, setStays] = useState<AccommodationItemData[]>([]);
  const [packages, setPackages] = useState<PackageItemData[]>([]);
  const [yogas, setYogas] = useState<YogaItemData[]>([]);
  const [retreats, setRetreats] = useState<any[]>([]);
  const [showRetreatModal, setShowRetreatModal] = useState(false);
  const [editingRetreat, setEditingRetreat] = useState<any>(null);
  const [selectedYogaType, setSelectedYogaType] = useState<string>("retreats");
  const [teachers, setTeachers] = useState<TeacherData[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryForm, setGalleryForm] = useState<any>({ category: "villa-accommodation", caption: { en: "", de: "", fr: "", ru: "" }, displayOrder: 0 });
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [galleryFilePreview, setGalleryFilePreview] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  // Edit gallery item state
  const [editingGalleryItem, setEditingGalleryItem] = useState<any | null>(null);
  const [showEditGalleryModal, setShowEditGalleryModal] = useState(false);
  const [editGalleryFile, setEditGalleryFile] = useState<File | null>(null);
  const [editGalleryFilePreview, setEditGalleryFilePreview] = useState<string | null>(null);
  const [isUpdatingGallery, setIsUpdatingGallery] = useState(false);

  // LOCALIZATION TAB
  const [activeLangTab, setActiveLangTab] = useState<"en" | "de" | "fr" | "ru">("en");
  const [activePkgFormTab, setActivePkgFormTab] = useState<string>("general");

  // IMAGE UPLOADS PREVIEWS
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageFiles, setCoverImageFiles] = useState<File[]>([]);
  const [coverImagePreviews, setCoverImagePreviews] = useState<string[]>([]);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState<string | null>(null);
  const [aboutImageFiles, setAboutImageFiles] = useState<File[]>([]);
  const [aboutImagePreviews, setAboutImagePreviews] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
  const [yogaHallImageFiles, setYogaHallImageFiles] = useState<File[]>([]);
  const [yogaHallImagePreviews, setYogaHallImagePreviews] = useState<string[]>([]);

  // MODALS STATE FOR SUBGROUPS (CATEGORIES)
  const [showSubgroupModal, setShowSubgroupModal] = useState(false);
  const [subgroupFormType, setSubgroupFormType] = useState<"accommodation" | "package" | "yoga">("accommodation");
  const [editingSubgroup, setEditingSubgroup] = useState<any | null>(null);
  const [savingSubgroup, setSavingSubgroup] = useState(false);
  const [subgroupForm, setSubgroupForm] = useState<any>({});
  const [hostRetreatTab, setHostRetreatTab] = useState<"general" | "features" | "experience-faqs" | "rooms" | "meals" | "logistics" | "policies" | "cancellation">("general");
  const [addonCount, setAddonCount] = useState(3);
  const [faqCount, setFaqCount] = useState(4);

  // Rooms editing sub-state
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [roomFilesMap, setRoomFilesMap] = useState<Record<number, File[]>>({});
  const [roomPreviewsMap, setRoomPreviewsMap] = useState<Record<number, string[]>>({});

  // MOBILE SIDEBAR
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // MODALS STATE FOR ITEMS
  const [showStayModal, setShowStayModal] = useState(false);
  const [editingStay, setEditingStay] = useState<AccommodationItemData | null>(null);
  const [savingStay, setSavingStay] = useState(false);
  const [stayForm, setStayForm] = useState<Partial<AccommodationItemData>>({});

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItemData | null>(null);
  const [savingPackage, setSavingPackage] = useState(false);
  const [packageForm, setPackageForm] = useState<Partial<PackageItemData>>({});

  const [showYogaModal, setShowYogaModal] = useState(false);
  const [editingYoga, setEditingYoga] = useState<YogaItemData | null>(null);
  const [savingYoga, setSavingYoga] = useState(false);
  const [yogaForm, setYogaForm] = useState<Partial<YogaItemData>>({});

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [teacherForm, setTeacherForm] = useState<Partial<TeacherData>>({});

  const [showHomepageModal, setShowHomepageModal] = useState(false);
  const [savingHomepage, setSavingHomepage] = useState(false);

  // Authenticate on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("villa_lemon_admin_token");
    const userStr = localStorage.getItem("villa_lemon_admin_user");
    if (!storedToken || !userStr) {
      router.push("/admin");
    } else {
      setToken(storedToken);
      setAdminUser(JSON.parse(userStr));
    }
  }, [router]);

  // Fetch lists
  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Accommodation Subgroups (Categories) & Items
      const [resAccCats, resStays] = await Promise.all([
        fetch(`${API_BASE_URL}/api/accommodations`),
        fetch(`${API_BASE_URL}/api/accommodations/items`)
      ]);
      if (resAccCats.ok) {
        const d = await resAccCats.json();
        setAccommodationCategories(d.data || []);
      }
      if (resStays.ok) {
        const d = await resStays.json();
        setStays(d.data || []);
      }

      // 2. Fetch Package Subgroups (Categories) & Items
      const [resPkgCats, resPackages] = await Promise.all([
        fetch(`${API_BASE_URL}/api/packages`),
        fetch(`${API_BASE_URL}/api/packages/items`)
      ]);
      if (resPkgCats.ok) {
        const d = await resPkgCats.json();
        setPackageCategories(d.data || []);
      }
      if (resPackages.ok) {
        const d = await resPackages.json();
        setPackages(d.data || []);
      }

      // 3. Fetch Yoga Subgroups (Categories) & Items
      const [resYogaCats, resYoga, resRetreats] = await Promise.all([
        fetch(`${API_BASE_URL}/api/yoga/programs`),
        fetch(`${API_BASE_URL}/api/yoga/items`),
        fetch(`${API_BASE_URL}/api/retreats`)
      ]);
      if (resYogaCats.ok) {
        const d = await resYogaCats.json();
        setYogaCategories(d.data || []);
      }
      if (resYoga.ok) {
        const d = await resYoga.json();
        setYogas(d.data || []);
      }
      if (resRetreats.ok) {
        const d = await resRetreats.json();
        setRetreats(d.data || []);
      }

      // 4. Fetch teachers
      const resTeachers = await fetch(`${API_BASE_URL}/api/yoga/teachers`);
      if (resTeachers.ok) {
        const d = await resTeachers.json();
        setTeachers(d.data || []);
      }

      // 5. Fetch Homepage dynamic texts
      const resHome = await fetch(`${API_BASE_URL}/api/homepage`);
      if (resHome.ok) {
        const d = await resHome.json();
        setHomepageData(d.data || null);
      }

      // 6. Fetch Enquiries / Messages (Admin access only)
      const resEnquiries = await fetch(`${API_BASE_URL}/api/enquiries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resEnquiries.ok) {
        const d = await resEnquiries.json();
        setEnquiries(d.data || []);
      }

      // 7. Fetch Gallery items
      const resGallery = await fetch(`${API_BASE_URL}/api/gallery`);
      if (resGallery.ok) {
        const d = await resGallery.json();
        setGalleryItems(d.data || []);
      }
    } catch (err) {
      console.error("Failed to load CMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("villa_lemon_admin_token");
    localStorage.removeItem("villa_lemon_admin_user");
    router.push("/admin");
  };

  // Helper localizer string init
  const createEmptyLocalizedText = (val = ""): LocalizedText => ({
    en: val,
    de: val,
    fr: val,
    ru: val,
  });

  // Helper handles cover image preview URL setup
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newBlobUrls = newFiles.map(file => URL.createObjectURL(file));
      // APPEND to existing list instead of replacing
      setCoverImageFiles(prev => [...prev, ...newFiles]);
      setCoverImagePreviews(prev => [...prev, ...newBlobUrls]);
      // Keep legacy single-file state for backward compat
      setCoverImageFile(newFiles[0]);
      setCoverImagePreview(newBlobUrls[0]);
      // Reset file input so the same file can be re-selected after removal
      e.target.value = "";
    }
  };

  // Remove a specific image from the cover images list
  const handleDeleteCoverImage = (idx: number) => {
    const url = coverImagePreviews[idx];
    // Count how many blob URLs precede this index to find the file index
    const blobUrlsBefore = coverImagePreviews.slice(0, idx).filter(u => u.startsWith("blob:"));
    const blobIdx = url.startsWith("blob:") ? blobUrlsBefore.length : -1;

    const newPreviews = coverImagePreviews.filter((_, i) => i !== idx);
    setCoverImagePreviews(newPreviews);

    if (blobIdx >= 0) {
      // Remove the corresponding new file
      const newFiles = coverImageFiles.filter((_, i) => i !== blobIdx);
      setCoverImageFiles(newFiles);
      URL.revokeObjectURL(url);
    }
    // If it was a server URL, it won't be in coverImageFiles — it's handled by existingImages on save
  };

  // Helper handles about image preview URL setup
  const handleAboutImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newBlobUrls = newFiles.map(file => URL.createObjectURL(file));
      setAboutImageFiles(prev => [...prev, ...newFiles]);
      setAboutImagePreviews(prev => [...prev, ...newBlobUrls]);
      // Keep legacy single-file state for backward compat
      setAboutImageFile(newFiles[0]);
      setAboutImagePreview(newBlobUrls[0]);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleDeleteAboutImage = (idx: number) => {
    const url = aboutImagePreviews[idx];
    const blobUrlsBefore = aboutImagePreviews.slice(0, idx).filter(u => u.startsWith("blob:"));
    const blobIdx = url.startsWith("blob:") ? blobUrlsBefore.length : -1;

    const newPreviews = aboutImagePreviews.filter((_, i) => i !== idx);
    setAboutImagePreviews(newPreviews);

    if (blobIdx >= 0) {
      const newFiles = aboutImageFiles.filter((_, i) => i !== blobIdx);
      setAboutImageFiles(newFiles);
      URL.revokeObjectURL(url);
    }
  };

  // Helper handles SEO OG image preview URL setup
  const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOgImageFile(file);
      setOgImagePreview(URL.createObjectURL(file));
    }
  };

  const handleReorder = async (
    resourceType: "accommodation" | "accommodationItem" | "package" | "packageItem" | "yoga" | "yogaItem" | "retreat",
    ids: string[]
  ) => {
    if (!token) return;
    try {
      let url = "";
      if (resourceType === "accommodation") url = `${API_BASE_URL}/api/accommodations/reorder`;
      else if (resourceType === "accommodationItem") url = `${API_BASE_URL}/api/accommodations/items/reorder`;
      else if (resourceType === "package") url = `${API_BASE_URL}/api/packages/reorder`;
      else if (resourceType === "packageItem") url = `${API_BASE_URL}/api/packages/items/reorder`;
      else if (resourceType === "yoga") url = `${API_BASE_URL}/api/yoga/programs/reorder`;
      else if (resourceType === "yogaItem") url = `${API_BASE_URL}/api/yoga/items/reorder`;
      else if (resourceType === "retreat") url = `${API_BASE_URL}/api/retreats/reorder`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids }),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        console.error("Failed to reorder:", errorJson.message);
      }
    } catch (err) {
      console.error("Reorder request failed:", err);
    }
  };

  const moveSubgroup = (
    type: "accommodation" | "package" | "yoga",
    index: number,
    direction: "up" | "down"
  ) => {
    let list: any[] = [];
    if (type === "accommodation") list = [...accommodationCategories];
    else if (type === "package") list = [...packageCategories];
    else if (type === "yoga") list = [...yogaCategories];

    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === list.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    if (type === "accommodation") setAccommodationCategories(list);
    else if (type === "package") setPackageCategories(list);
    else if (type === "yoga") setYogaCategories(list);

    handleReorder(type, list.map(item => item._id));
  };

  const moveProgramItem = (
    resourceType: "accommodationItem" | "packageItem" | "yogaItem" | "retreat",
    index: number,
    direction: "up" | "down",
    subgroupKey: string
  ) => {
    let list: any[] = [];
    if (resourceType === "accommodationItem") {
      list = stays.filter(item => item.accommodationType === subgroupKey);
    } else if (resourceType === "packageItem") {
      list = packages.filter(item => Array.isArray(item.packageCategory) ? item.packageCategory.includes(subgroupKey as any) : item.packageCategory === subgroupKey);
    } else if (resourceType === "yogaItem") {
      list = yogas.filter(item => item.yogaType === subgroupKey);
    } else if (resourceType === "retreat") {
      list = [...retreats];
    }

    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === list.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    let mergedList: any[] = [];
    if (resourceType === "accommodationItem") {
      mergedList = [
        ...stays.filter(item => item.accommodationType !== subgroupKey),
        ...list
      ];
      setStays(mergedList);
    } else if (resourceType === "packageItem") {
      mergedList = [
        ...packages.filter(item => Array.isArray(item.packageCategory) ? !item.packageCategory.includes(subgroupKey as any) : item.packageCategory !== subgroupKey),
        ...list
      ];
      setPackages(mergedList);
    } else if (resourceType === "yogaItem") {
      mergedList = [
        ...yogas.filter(item => item.yogaType !== subgroupKey),
        ...list
      ];
      setYogas(mergedList);
    } else if (resourceType === "retreat") {
      mergedList = list;
      setRetreats(mergedList);
    }

    handleReorder(resourceType, list.map(item => item._id));
  };

  // ------------------------------------------------------------------
  // SUBGROUP (CATEGORY) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddSubgroup = (formType: "accommodation" | "package" | "yoga") => {
    setSubgroupFormType(formType);
    setEditingSubgroup(null);
    
    setSubgroupForm({
      type: formType === "accommodation" ? "villa" : formType === "yoga" ? "retreats" : "",
      category: formType === "package" ? "varkalaSightseeing" : "",
      href: "",
      title: createEmptyLocalizedText(),
      description: createEmptyLocalizedText(),
      price: formType === "accommodation" ? createEmptyLocalizedText("From ₹15,000") : undefined,
      explore: createEmptyLocalizedText("Explore Options"),
      template: "default",
      hideRate: false,
    });

    setCoverImagePreview(null);
    setCoverImageFile(null);
    setCoverImagePreviews([]);
    setCoverImageFiles([]);
    setYogaHallImageFiles([]);
    setYogaHallImagePreviews([]);
    setRoomFilesMap({});
    setRoomPreviewsMap({});
    setEditingRoomIndex(null);
    setShowRoomForm(false);
    setShowSubgroupModal(true);
  };

  const handleOpenEditSubgroup = (cat: any, formType: "accommodation" | "package" | "yoga") => {
    setSubgroupFormType(formType);
    setEditingSubgroup(cat);
    
    // Deep clone and fill in defaults
    const catCopy = { ...cat };
    if (formType === "yoga" && (catCopy.type === "host retreat" || catCopy.type === "host-retreat" || catCopy.template === "host-retreat" || catCopy.template === "host retreat" || catCopy.href?.includes("host-your-yoga-retreat") || catCopy.href?.includes("host-retreat"))) {
      const config = { ...(catCopy.hostRetreatConfig || {}) };
      Object.keys(DEFAULT_HOST_RETREAT_CONFIG).forEach((key) => {
        if (!config[key]) {
          config[key] = (DEFAULT_HOST_RETREAT_CONFIG as any)[key];
        }
      });
      if (!config.rooms || config.rooms.length === 0) {
        config.rooms = JSON.parse(JSON.stringify(DEFAULT_HOST_RETREAT_CONFIG.rooms));
      }
      catCopy.hostRetreatConfig = config;
    }

    setSubgroupForm({ template: "default", ...catCopy });
    setCoverImagePreview(catCopy.image);
    setCoverImageFile(null);
    setCoverImagePreviews(catCopy.images && catCopy.images.length > 0 ? catCopy.images : [catCopy.image]);
    setCoverImageFiles([]);
    setYogaHallImageFiles([]);
    const config = catCopy.hostRetreatConfig || {};
    const yHallImages = config.yogaHallImages || (config.yogaHallImage ? [config.yogaHallImage] : []);
    setYogaHallImagePreviews(yHallImages);
    setRoomFilesMap({});
    setRoomPreviewsMap({});
    setEditingRoomIndex(null);
    setShowRoomForm(false);
    setShowSubgroupModal(true);
  };

  const getRetreatConfigVal = (key: string, lang: string = activeLangTab) => {
    return subgroupForm.hostRetreatConfig?.[key]?.[lang] || "";
  };

  const setRetreatConfigVal = (key: string, val: string, lang: string = activeLangTab) => {
    const config = subgroupForm.hostRetreatConfig || {};
    const fieldObj = config[key] || {};
    setSubgroupForm({
      ...subgroupForm,
      hostRetreatConfig: {
        ...config,
        [key]: {
          ...fieldObj,
          [lang]: val
        }
      }
    });
  };

  // Remove an addon at position `num` and shift all subsequent ones down
  const removeAddon = (num: number) => {
    const langs = ["en", "de", "fr", "ru"];
    const config = { ...(subgroupForm.hostRetreatConfig || {}) };
    // Shift items down from num+1 to addonCount
    for (let i = num; i < addonCount; i++) {
      const nextTitle = config[`addon${i + 1}Title`];
      const nextDesc = config[`addon${i + 1}Desc`];
      config[`addon${i}Title`] = nextTitle || langs.reduce((a, l) => ({ ...a, [l]: "" }), {});
      config[`addon${i}Desc`] = nextDesc || langs.reduce((a, l) => ({ ...a, [l]: "" }), {});
    }
    // Clear the last slot
    langs.forEach(l => {
      config[`addon${addonCount}Title`] = { ...config[`addon${addonCount}Title`], [l]: "" };
      config[`addon${addonCount}Desc`] = { ...config[`addon${addonCount}Desc`], [l]: "" };
    });
    setSubgroupForm({ ...subgroupForm, hostRetreatConfig: config });
    setAddonCount(c => c - 1);
  };

  // Remove a FAQ at position `num` and shift all subsequent ones down
  const removeFaq = (num: number) => {
    const langs = ["en", "de", "fr", "ru"];
    const config = { ...(subgroupForm.hostRetreatConfig || {}) };
    for (let i = num; i < faqCount; i++) {
      const nextQ = config[`faq${i + 1}Question`];
      const nextA = config[`faq${i + 1}Answer`];
      config[`faq${i}Question`] = nextQ || langs.reduce((a, l) => ({ ...a, [l]: "" }), {});
      config[`faq${i}Answer`] = nextA || langs.reduce((a, l) => ({ ...a, [l]: "" }), {});
    }
    langs.forEach(l => {
      config[`faq${faqCount}Question`] = { ...config[`faq${faqCount}Question`], [l]: "" };
      config[`faq${faqCount}Answer`] = { ...config[`faq${faqCount}Answer`], [l]: "" };
    });
    setSubgroupForm({ ...subgroupForm, hostRetreatConfig: config });
    setFaqCount(c => c - 1);
  };

  const handleAddRoomClick = () => {
    const config = subgroupForm.hostRetreatConfig || {};
    const rooms = config.rooms || [];
    const newRoomIndex = rooms.length;
    
    const newRoom = {
      id: Math.random().toString(36).substr(2, 9),
      number: "",
      phase: 1,
      ac: false,
      category: { en: "", de: "", fr: "", ru: "" },
      balcony: { en: "", de: "", fr: "", ru: "" },
      beds: { en: "", de: "", fr: "", ru: "" },
      wardrobe: { en: "", de: "", fr: "", ru: "" },
      bathroom: { en: "Attached", de: "Attached", fr: "Attached", ru: "Attached" },
      hotWater: { en: "Geyser System", de: "Geyser System", fr: "Geyser System", ru: "Geyser System" },
      notes: { en: "", de: "", fr: "", ru: "" },
      images: [],
      imagePublicIds: []
    };
    
    setSubgroupForm({
      ...subgroupForm,
      hostRetreatConfig: {
        ...config,
        rooms: [...rooms, newRoom]
      }
    });
    
    setEditingRoomIndex(newRoomIndex);
    setShowRoomForm(true);
  };

  const handleEditRoomClick = (index: number) => {
    setEditingRoomIndex(index);
    setShowRoomForm(true);
  };

  const handleDeleteRoomClick = (index: number) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    const config = subgroupForm.hostRetreatConfig || {};
    const rooms = [...(config.rooms || [])];
    rooms.splice(index, 1);
    
    const newFilesMap: Record<number, File[]> = {};
    const newPreviewsMap: Record<number, string[]> = {};
    
    Object.keys(roomFilesMap).forEach((key) => {
      const idx = parseInt(key);
      if (idx > index) {
        newFilesMap[idx - 1] = roomFilesMap[idx];
      } else if (idx < index) {
        newFilesMap[idx] = roomFilesMap[idx];
      }
    });
    
    Object.keys(roomPreviewsMap).forEach((key) => {
      const idx = parseInt(key);
      if (idx > index) {
        newPreviewsMap[idx - 1] = roomPreviewsMap[idx];
      } else if (idx < index) {
        newPreviewsMap[idx] = roomPreviewsMap[idx];
      }
    });
    
    setRoomFilesMap(newFilesMap);
    setRoomPreviewsMap(newPreviewsMap);
    
    setSubgroupForm({
      ...subgroupForm,
      hostRetreatConfig: {
        ...config,
        rooms
      }
    });
  };

  const handleRoomFieldChange = (field: string, val: any, lang?: string) => {
    if (editingRoomIndex === null) return;
    const config = subgroupForm.hostRetreatConfig || {};
    const rooms = [...(config.rooms || [])];
    const room = { ...rooms[editingRoomIndex] };
    
    if (lang) {
      const fieldObj = (room as any)[field] || {};
      (room as any)[field] = {
        ...fieldObj,
        [lang]: val
      };
    } else {
      (room as any)[field] = val;
    }
    
    rooms[editingRoomIndex] = room;
    setSubgroupForm({
      ...subgroupForm,
      hostRetreatConfig: {
        ...config,
        rooms
      }
    });
  };

  const handleRoomImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newFiles = [...(roomFilesMap[index] || []), ...filesArray];
      const newPreviews = [
        ...(roomPreviewsMap[index] || []),
        ...filesArray.map(f => URL.createObjectURL(f))
      ];
      
      setRoomFilesMap({
        ...roomFilesMap,
        [index]: newFiles
      });
      setRoomPreviewsMap({
        ...roomPreviewsMap,
        [index]: newPreviews
      });
    }
  };

  const handleDeleteRoomImage = (roomIndex: number, imageIndex: number) => {
    const config = subgroupForm.hostRetreatConfig || {};
    const rooms = [...(config.rooms || [])];
    const room = { ...rooms[roomIndex] };
    
    const serverImages = room.images || [];
    const serverPublicIds = room.imagePublicIds || [];
    const localFiles = roomFilesMap[roomIndex] || [];
    const localPreviews = roomPreviewsMap[roomIndex] || [];
    
    if (imageIndex < serverImages.length) {
      const newImages = serverImages.filter((_: string, i: number) => i !== imageIndex);
      const newPublicIds = serverPublicIds.filter((_: string, i: number) => i !== imageIndex);
      room.images = newImages;
      room.imagePublicIds = newPublicIds;
      rooms[roomIndex] = room;
      
      setSubgroupForm({
        ...subgroupForm,
        hostRetreatConfig: {
          ...config,
          rooms
        }
      });
    } else {
      const localIdx = imageIndex - serverImages.length;
      const newLocalFiles = localFiles.filter((_: File, i: number) => i !== localIdx);
      const newLocalPreviews = localPreviews.filter((_: string, i: number) => i !== localIdx);
      
      setRoomFilesMap({
        ...roomFilesMap,
        [roomIndex]: newLocalFiles
      });
      setRoomPreviewsMap({
        ...roomPreviewsMap,
        [roomIndex]: newLocalPreviews
      });
    }
  };

  const handleYogaHallImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setYogaHallImageFiles((prev) => [...prev, ...filesArray]);
      setYogaHallImagePreviews((prev) => [
        ...prev,
        ...filesArray.map((f) => URL.createObjectURL(f))
      ]);
    }
  };

  const handleDeleteYogaHallImage = (index: number) => {
    const keptServerUrls = yogaHallImagePreviews.filter((u) => !u.startsWith("blob:"));
    const localPreviews = yogaHallImagePreviews.filter((u) => u.startsWith("blob:"));
    
    if (index < keptServerUrls.length) {
      const newServerUrls = keptServerUrls.filter((_, i) => i !== index);
      setYogaHallImagePreviews([...newServerUrls, ...localPreviews]);
    } else {
      const localIdx = index - keptServerUrls.length;
      const newLocalFiles = yogaHallImageFiles.filter((_, i) => i !== localIdx);
      const newLocalPreviews = localPreviews.filter((_, i) => i !== localIdx);
      setYogaHallImageFiles(newLocalFiles);
      setYogaHallImagePreviews([...keptServerUrls, ...newLocalPreviews]);
    }
  };

  const handleSaveSubgroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSavingSubgroup(true);

    try {
      const formData = new FormData();
      if (subgroupFormType === "accommodation") {
        formData.append("type", subgroupForm.type || "villa");
        formData.append("price", JSON.stringify(subgroupForm.price));
        formData.append("hideRate", String(subgroupForm.hideRate || false));
      } else if (subgroupFormType === "package") {
        formData.append("category", subgroupForm.category || "varkalaSightseeing");
      } else if (subgroupFormType === "yoga") {
        formData.append("type", subgroupForm.type || "retreats");
      }

      let hrefValue = subgroupForm.href || "";
      if (subgroupFormType === "yoga" && !hrefValue) {
        if (subgroupForm.type === "retreats") {
          hrefValue = "/yoga/yoga-retreats";
        } else if (subgroupForm.type === "classes") {
          hrefValue = "/yoga/daily-yoga-classes";
        } else if (subgroupForm.type === "private") {
          hrefValue = "/yoga/private-yoga-sessions";
        } else if (subgroupForm.type) {
          hrefValue = `/yoga/${subgroupForm.type}`;
        }
      }
      hrefValue = hrefValue.trim();
      if (hrefValue.toLowerCase().startsWith("yoga/")) {
        hrefValue = "/yoga/" + hrefValue.substring(5);
      } else if (hrefValue.toLowerCase().startsWith("/yoga/")) {
        hrefValue = "/yoga/" + hrefValue.substring(6);
      }
      formData.append("href", hrefValue);
      formData.append("template", subgroupForm.template || "default");
      formData.append("title", JSON.stringify(subgroupForm.title));
      formData.append("description", JSON.stringify(subgroupForm.description));
      formData.append("explore", JSON.stringify(subgroupForm.explore));

      if (subgroupFormType === "accommodation") {
        const sf = subgroupForm as any;
        for (const n of [1, 2, 3, 4]) {
          const titleKey = `feature${n}Title`;
          const subtitleKey = `feature${n}Subtitle`;
          if (sf[titleKey]) formData.append(titleKey, JSON.stringify(sf[titleKey]));
          if (sf[subtitleKey]) formData.append(subtitleKey, JSON.stringify(sf[subtitleKey]));
        }
      }

      if (subgroupFormType === "yoga" && subgroupForm.type === "host retreat") {
        const config = { ...(subgroupForm.hostRetreatConfig || {}) };
        Object.keys(DEFAULT_HOST_RETREAT_CONFIG).forEach((key) => {
          if (!config[key]) {
            config[key] = (DEFAULT_HOST_RETREAT_CONFIG as any)[key];
          }
        });
        if (!config.rooms || config.rooms.length === 0) {
          config.rooms = JSON.parse(JSON.stringify(DEFAULT_HOST_RETREAT_CONFIG.rooms));
        }
        formData.append("hostRetreatConfig", JSON.stringify(config));
        
        // Append new yoga hall files
        yogaHallImageFiles.forEach((file) => {
          formData.append("yogaHallImages", file);
        });
        
        // Append existing yoga hall URLs to keep
        const keptYogaHallUrls = yogaHallImagePreviews.filter(u => !u.startsWith("blob:"));
        formData.append("existingYogaHallImages", JSON.stringify(keptYogaHallUrls));
        
        // Append room-specific images
        Object.keys(roomFilesMap).forEach((key) => {
          const roomIdx = parseInt(key);
          const filesArray = roomFilesMap[roomIdx] || [];
          filesArray.forEach((file) => {
            formData.append(`roomImages_${roomIdx}`, file);
          });
        });
      }

      // Send which existing server images to keep (non-blob URLs)
      const existingImageUrls = coverImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingImages", JSON.stringify(existingImageUrls));
      // Append only new file uploads
      coverImageFiles.forEach(file => {
        formData.append("images", file);
      });

      let url = "";
      if (subgroupFormType === "accommodation") {
        url = editingSubgroup 
          ? `${API_BASE_URL}/api/accommodations/${editingSubgroup._id}`
          : `${API_BASE_URL}/api/accommodations`;
      } else if (subgroupFormType === "package") {
        url = editingSubgroup
          ? `${API_BASE_URL}/api/packages/${editingSubgroup._id}`
          : `${API_BASE_URL}/api/packages`;
      } else if (subgroupFormType === "yoga") {
        url = editingSubgroup
          ? `${API_BASE_URL}/api/yoga/programs/${editingSubgroup._id}`
          : `${API_BASE_URL}/api/yoga/programs`;
      }

      const method = editingSubgroup ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowSubgroupModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save category");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving category.");
    } finally {
      setSavingSubgroup(false);
    }
  };

  const handleDeleteSubgroup = async (id: string, formType: "accommodation" | "package" | "yoga") => {
    if (!token || !confirm("Delete this category subgroup? This might affect homepage sections.")) return;
    try {
      let url = "";
      if (formType === "accommodation") url = `${API_BASE_URL}/api/accommodations/${id}`;
      else if (formType === "package") url = `${API_BASE_URL}/api/packages/${id}`;
      else if (formType === "yoga") url = `${API_BASE_URL}/api/yoga/programs/${id}`;

      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // STAYS (ITEMS) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddStay = (prefilledType?: "villa" | "floor" | "room") => {
    setEditingStay(null);
    setStayForm({
      accommodationType: prefilledType || "villa",
      slug: "",
      price: 15000,
      bedrooms: 2,
      bathrooms: 2,
      guests: 4,
      checkInTime: "14:00",
      checkOutTime: "11:00",
      title: createEmptyLocalizedText(),
      pricePeriod: createEmptyLocalizedText("/ night"),
      location: createEmptyLocalizedText("Varkala, Kerala"),
      shortDescription: createEmptyLocalizedText(),
      tagline: createEmptyLocalizedText(),
      aboutText1: createEmptyLocalizedText(),
      aboutText2: createEmptyLocalizedText(),
      perfectLocationText: createEmptyLocalizedText(),
      groupAccommodationText: createEmptyLocalizedText(),
      highlights: [
        { icon: "pool", label: createEmptyLocalizedText("Private Pool") },
        { icon: "wifi", label: createEmptyLocalizedText("Free Wi-Fi") }
      ],
      whyGuestsLoveUs: [
        { icon: "shield", title: createEmptyLocalizedText("Security"), desc: createEmptyLocalizedText("Secure gated facility.") }
      ],
      distances: [
        { place: createEmptyLocalizedText("Black Beach"), distance: createEmptyLocalizedText("900 m") }
      ],
      roomAmenities: [createEmptyLocalizedText("Air Conditioning"), createEmptyLocalizedText("Hot Water")],
      idealFor: [createEmptyLocalizedText("Wellness Groups"), createEmptyLocalizedText("Family Stays")],
      checkInOutRules: [createEmptyLocalizedText("Quiet hours after 10 PM.")],
      additionalServices: [
        { service: createEmptyLocalizedText("Laundry"), details: createEmptyLocalizedText("Paid service.") }
      ],
      relatedAccommodations: ["", "", ""],
      badgeText: createEmptyLocalizedText(),
      hideRate: false,
      metaTitle: createEmptyLocalizedText(),
      metaDescription: createEmptyLocalizedText(),
      keywords: createEmptyLocalizedText(),
      canonicalUrl: "",
      notes: createEmptyLocalizedText(),
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setCoverImagePreviews([]);
    setCoverImageFiles([]);
    setAboutImagePreview(null);
    setAboutImageFile(null);
    setAboutImagePreviews([]);
    setAboutImageFiles([]);
    setNewGalleryFiles([]);
    setOgImagePreview(null);
    setOgImageFile(null);
    setShowStayModal(true);
  };

  const getSEOKeywords = (type: string, title: string, slug: string): string => {
    const t = (title || "").toLowerCase();
    const s = (slug || "").toLowerCase();
    
    if (t.includes("inn") || s.includes("inn")) {
      return "boutique hotel varkala, superior room varkala, villa lemon inn, premium accommodation varkala, boutique stay kerala, hotel near varkala cliff, luxury stay varkala, balcony room varkala";
    }
    
    if (t.includes("apartment") || s.includes("apartment")) {
      return "2 bhk apartment varkala, private apartment varkala, villa lemon garden, apartment with kitchen varkala, family apartment varkala, holiday apartment kerala, self catering apartment, long stay accommodation varkala, group stay varkala";
    }
    
    if (type === "villa" || t.includes("villa") || s.includes("villa")) {
      return "entire villa varkala, luxury villa varkala, villa lemon garden, private villa kerala, family villa varkala, holiday villa varkala, villa with garden varkala, group villa kerala, vacation home varkala";
    }
    
    if (type === "floor" || t.includes("floor") || s.includes("floor")) {
      return "private floor varkala, 2 bhk floor varkala, 3 bhk floor varkala, family stay varkala, group accommodation varkala, villa lemon homestay, long stay varkala, group holiday kerala";
    }
    
    return "deluxe room varkala, budget room varkala, accommodation in varkala, villa lemon, homestay varkala, room near varkala cliff, stay in varkala, hotel room varkala, affordable room varkala, beach stay kerala";
  };

  const handleOpenEditStay = (s: AccommodationItemData) => {
    setEditingStay(s);

    const accTitleEn = s.title?.en || "";
    const accTitleDe = s.title?.de || "";
    const accTitleFr = s.title?.fr || "";
    const accTitleRu = s.title?.ru || "";

    const highlightsListEn = (s.highlights || []).map(h => h.label?.en || "").filter(Boolean).slice(0, 3).join(", ");
    const highlightsListDe = (s.highlights || []).map(h => h.label?.de || "").filter(Boolean).slice(0, 3).join(", ");
    const highlightsListFr = (s.highlights || []).map(h => h.label?.fr || "").filter(Boolean).slice(0, 3).join(", ");
    const highlightsListRu = (s.highlights || []).map(h => h.label?.ru || "").filter(Boolean).slice(0, 3).join(", ");

    const defaultFeaturesEn = highlightsListEn || "comfortable rooms, modern conveniences and peaceful surroundings";
    const defaultFeaturesDe = highlightsListDe || "komfortable Zimmer, moderne Annehmlichkeiten und eine ruhige Umgebung";
    const defaultFeaturesFr = highlightsListFr || "chambres confortables, commodités modernes et environnement paisible";
    const defaultFeaturesRu = highlightsListRu || "комфортабельные номера, современные удобства и спокойная обстановка";

    const defaultKeywords = getSEOKeywords(s.accommodationType || "room", accTitleEn, s.slug);

    const metaTitle = {
      en: (s.metaTitle?.en || "").trim() || `${accTitleEn} | Villa Lemon | Varkala, Kerala`,
      de: (s.metaTitle?.de || "").trim() || `${accTitleDe} | Villa Lemon | Varkala, Kerala`,
      fr: (s.metaTitle?.fr || "").trim() || `${accTitleFr} | Villa Lemon | Varkala, Kerala`,
      ru: (s.metaTitle?.ru || "").trim() || `${accTitleRu} | Villa Lemon | Varkala, Kerala`,
    };

    const metaDescription = {
      en: (s.metaDescription?.en || "").trim() || `Stay at ${accTitleEn} in Varkala featuring ${defaultFeaturesEn}. Enjoy free Wi-Fi, modern amenities, peaceful surroundings, and easy access to Varkala Cliff and nearby beaches.`,
      de: (s.metaDescription?.de || "").trim() || `Übernachten Sie im ${accTitleDe} in Varkala mit ${defaultFeaturesDe}. Genießen Sie kostenloses WLAN, moderne Annehmlichkeiten, eine ruhige Umgebung und einfachen Zugang zur Klippe von Varkala und den nahe gelegenen Stränden.`,
      fr: (s.metaDescription?.fr || "").trim() || `Séjournez au ${accTitleFr} à Varkala avec ${defaultFeaturesFr}. Profitez du Wi-Fi gratuit, des équipements modernes, d'un environnement paisible et d'un accès facile à la falaise de Varkala et aux plages de la région.`,
      ru: (s.metaDescription?.ru || "").trim() || `Остановитесь в ${accTitleRu} в Варкале с ${defaultFeaturesRu}. К услугам гостей бесплатный Wi-Fi, современные удобства, спокойная обстановка и легкий доступ к клифу Варкалы и близлежащим пляжам.`,
    };

    const keywords = {
      en: (s.keywords?.en || "").trim() || defaultKeywords,
      de: (s.keywords?.de || "").trim() || defaultKeywords,
      fr: (s.keywords?.fr || "").trim() || defaultKeywords,
      ru: (s.keywords?.ru || "").trim() || defaultKeywords,
    };

    const canonicalUrl = (s.canonicalUrl || "").trim() || `https://villalemon.in/en/accommodation/${s.accommodationType || "room"}/${s.slug}`;

    setStayForm({
      ...s,
      relatedAccommodations: s.relatedAccommodations || ["", "", ""],
      badgeText: s.badgeText || createEmptyLocalizedText(),
      hideRate: s.hideRate || false,
      metaTitle,
      metaDescription,
      keywords,
      canonicalUrl,
      notes: s.notes || createEmptyLocalizedText(),
    });
    setCoverImagePreview(s.image);
    setCoverImageFile(null);
    setCoverImagePreviews(s.images && s.images.length > 0 ? s.images : [s.image]);
    setCoverImageFiles([]);
    setAboutImagePreview(s.aboutImage);
    setAboutImageFile(null);
    setAboutImagePreviews(s.aboutImages && s.aboutImages.length > 0 ? s.aboutImages : s.aboutImage ? [s.aboutImage] : []);
    setAboutImageFiles([]);
    setNewGalleryFiles([]);
    setOgImagePreview(s.ogImage || null);
    setOgImageFile(null);
    setShowStayModal(true);
  };

  const handleSaveStay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSavingStay(true);

    try {
      const formData = new FormData();
      formData.append("accommodationType", stayForm.accommodationType || "villa");
      formData.append("slug", stayForm.slug || "");
      formData.append("price", String(stayForm.price || 0));
      formData.append("bedrooms", String(stayForm.bedrooms || 0));
      formData.append("bathrooms", String(stayForm.bathrooms || 0));
      formData.append("guests", String(stayForm.guests || 0));
      formData.append("checkInTime", stayForm.checkInTime || "14:00");
      formData.append("checkOutTime", stayForm.checkOutTime || "11:00");
      formData.append("mapLink", stayForm.mapLink || "");

      formData.append("title", JSON.stringify(stayForm.title));
      formData.append("pricePeriod", JSON.stringify(stayForm.pricePeriod));
      formData.append("location", JSON.stringify(stayForm.location));
      formData.append("shortDescription", JSON.stringify(stayForm.shortDescription));
      formData.append("tagline", JSON.stringify(stayForm.tagline));
      formData.append("aboutText1", JSON.stringify(stayForm.aboutText1));
      formData.append("aboutText2", JSON.stringify(stayForm.aboutText2));
      formData.append("perfectLocationText", JSON.stringify(stayForm.perfectLocationText));
      formData.append("groupAccommodationText", JSON.stringify(stayForm.groupAccommodationText));

      formData.append("highlights", JSON.stringify(stayForm.highlights || []));
      formData.append("whyGuestsLoveUs", JSON.stringify(stayForm.whyGuestsLoveUs || []));
      formData.append("distances", JSON.stringify(stayForm.distances || []));
      formData.append("roomAmenities", JSON.stringify(stayForm.roomAmenities || []));
      formData.append("idealFor", JSON.stringify(stayForm.idealFor || []));
      formData.append("checkInOutRules", JSON.stringify(stayForm.checkInOutRules || []));
      formData.append("additionalServices", JSON.stringify(stayForm.additionalServices || []));
      
      // Automatically prefill SEO fields on save if they are blank
      const accTitleEn = stayForm.title?.en || "";
      const accTitleDe = stayForm.title?.de || "";
      const accTitleFr = stayForm.title?.fr || "";
      const accTitleRu = stayForm.title?.ru || "";

      const highlightsListEn = (stayForm.highlights || []).map(h => h.label?.en || "").filter(Boolean).slice(0, 3).join(", ");
      const highlightsListDe = (stayForm.highlights || []).map(h => h.label?.de || "").filter(Boolean).slice(0, 3).join(", ");
      const highlightsListFr = (stayForm.highlights || []).map(h => h.label?.fr || "").filter(Boolean).slice(0, 3).join(", ");
      const highlightsListRu = (stayForm.highlights || []).map(h => h.label?.ru || "").filter(Boolean).slice(0, 3).join(", ");

      const defaultFeaturesEn = highlightsListEn || "comfortable rooms, modern conveniences and peaceful surroundings";
      const defaultFeaturesDe = highlightsListDe || "komfortable Zimmer, moderne Annehmlichkeiten und eine ruhige Umgebung";
      const defaultFeaturesFr = highlightsListFr || "chambres confortables, commodités modernes et environnement paisible";
      const defaultFeaturesRu = highlightsListRu || "комфортабельные номера, современные удобства и спокойная обстановка";

      const defaultKeywords = getSEOKeywords(stayForm.accommodationType || "room", accTitleEn, stayForm.slug || "");

      const finalMetaTitle = {
        en: (stayForm.metaTitle?.en || "").trim() || `${accTitleEn} | Villa Lemon | Varkala, Kerala`,
        de: (stayForm.metaTitle?.de || "").trim() || `${accTitleDe} | Villa Lemon | Varkala, Kerala`,
        fr: (stayForm.metaTitle?.fr || "").trim() || `${accTitleFr} | Villa Lemon | Varkala, Kerala`,
        ru: (stayForm.metaTitle?.ru || "").trim() || `${accTitleRu} | Villa Lemon | Varkala, Kerala`,
      };

      const finalMetaDesc = {
        en: (stayForm.metaDescription?.en || "").trim() || `Stay at ${accTitleEn} in Varkala featuring ${defaultFeaturesEn}. Enjoy free Wi-Fi, modern amenities, peaceful surroundings, and easy access to Varkala Cliff and nearby beaches.`,
        de: (stayForm.metaDescription?.de || "").trim() || `Übernachten Sie im ${accTitleDe} in Varkala mit ${defaultFeaturesDe}. Genießen Sie kostenloses WLAN, moderne Annehmlichkeiten, eine ruhige Umgebung und einfachen Zugang zur Klippe von Varkala und den nahe gelegenen Stränden.`,
        fr: (stayForm.metaDescription?.fr || "").trim() || `Séjournez au ${accTitleFr} à Varkala avec ${defaultFeaturesFr}. Profitez du Wi-Fi gratuit, des équipements modernes, d'un environnement paisible et d'un accès facile à la falaise de Varkala et aux plages de la région.`,
        ru: (stayForm.metaDescription?.ru || "").trim() || `Остановитесь в ${accTitleRu} в Варкале с ${defaultFeaturesRu}. К услугам гостей бесплатный Wi-Fi, современные удобства, спокойная обстановка и легкий доступ к клифу Варкалы и близлежащим пляжам.`,
      };

      const finalKeywords = {
        en: (stayForm.keywords?.en || "").trim() || defaultKeywords,
        de: (stayForm.keywords?.de || "").trim() || defaultKeywords,
        fr: (stayForm.keywords?.fr || "").trim() || defaultKeywords,
        ru: (stayForm.keywords?.ru || "").trim() || defaultKeywords,
      };

      const finalCanonical = (stayForm.canonicalUrl || "").trim() || `https://villalemon.in/en/accommodation/${stayForm.accommodationType || "room"}/${stayForm.slug}`;

      const filteredRelated = (stayForm.relatedAccommodations || []).filter(Boolean);
      formData.append("relatedAccommodations", JSON.stringify(filteredRelated));
      formData.append("badgeText", JSON.stringify(stayForm.badgeText || createEmptyLocalizedText()));
      formData.append("hideRate", String(stayForm.hideRate || false));
      formData.append("metaTitle", JSON.stringify(finalMetaTitle));
      formData.append("metaDescription", JSON.stringify(finalMetaDesc));
      formData.append("keywords", JSON.stringify(finalKeywords));
      formData.append("canonicalUrl", finalCanonical);
      formData.append("notes", JSON.stringify(stayForm.notes || createEmptyLocalizedText()));
      if (ogImageFile) formData.append("ogImage", ogImageFile);

      // Send which existing server images to keep (non-blob URLs)
      const existingImageUrls = coverImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingImages", JSON.stringify(existingImageUrls));
      // Append only new file uploads
      coverImageFiles.forEach(file => {
        formData.append("images", file);
      });

      // Send which existing about images to keep
      const existingAboutUrls = aboutImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingAboutImages", JSON.stringify(existingAboutUrls));
      // Append only new about image uploads
      aboutImageFiles.forEach(file => {
        formData.append("aboutImage", file);
      });
      
      // Append gallery uploads and existing links
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((file) => {
          formData.append("gallery", file);
        });
      }
      formData.append("existingGallery", JSON.stringify(stayForm.gallery || []));

      const url = editingStay
        ? `${API_BASE_URL}/api/accommodations/items/${editingStay._id}`
        : `${API_BASE_URL}/api/accommodations/items`;
      const method = editingStay ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowStayModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save stay details");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving stay details.");
    } finally {
      setSavingStay(false);
    }
  };

  const handleDeleteStay = async (id: string) => {
    if (!token || !confirm("Delete this property? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/accommodations/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
      else alert("Delete failed");
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // PACKAGES (ITEMS) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddPackage = (prefilledCategory?: string) => {
    setEditingPackage(null);
    setPackageForm({
      packageCategory: prefilledCategory ? [prefilledCategory as any] : ["varkalaSightseeing"],
      slug: "",
      price: 2500,
      title: createEmptyLocalizedText(),
      pricePeriod: createEmptyLocalizedText("/ person"),
      duration: createEmptyLocalizedText("4 Hours"),
      shortDescription: createEmptyLocalizedText(),
      tagline: createEmptyLocalizedText(),
      aboutText: createEmptyLocalizedText(),
      inclusions: [createEmptyLocalizedText("Guide service"), createEmptyLocalizedText("Water bottle")],
      exclusions: [createEmptyLocalizedText("Camera charges")],
      itinerary: [
        { timeOrDay: createEmptyLocalizedText("09:00 AM"), activity: createEmptyLocalizedText("Pick-up"), desc: createEmptyLocalizedText("Meeting at cliff helipad.") }
      ],
      itineraryEvening: [
        { timeOrDay: createEmptyLocalizedText("03:30 PM"), activity: createEmptyLocalizedText("Pick-up"), desc: createEmptyLocalizedText("Meeting at cliff helipad.") }
      ],
      highlights: [{ icon: "compass", label: createEmptyLocalizedText("Sightseeing") }],
      whyGuestsLoveUs: [{ icon: "star", title: createEmptyLocalizedText("Best Guides"), desc: createEmptyLocalizedText("Expert storytellers.") }],
      
      // General Info
      travelTime: createEmptyLocalizedText("1 Hour"),
      entryFee: createEmptyLocalizedText("None"),
      optionalCharges: createEmptyLocalizedText("None"),
      difficulty: createEmptyLocalizedText("Easy"),
      groupSize: createEmptyLocalizedText("Up to 10"),
      location: createEmptyLocalizedText("Varkala"),

      // Localized Content
      tourOverview: createEmptyLocalizedText(),
      bestTime: createEmptyLocalizedText("October to March"),
      dressCode: createEmptyLocalizedText("Casual"),
      cta: createEmptyLocalizedText("Book Now"),

      // Media
      gallery: [],
      video: "",

      // Structural lists
      quickFacts: [{ key: createEmptyLocalizedText("Duration"), value: createEmptyLocalizedText("4 Hours") }],
      thingsToBring: [createEmptyLocalizedText("Sunscreen"), createEmptyLocalizedText("Sunglasses")],
      nearbyAttractions: [{ name: createEmptyLocalizedText("Varkala Cliff"), distance: createEmptyLocalizedText("2 km") }],
      relatedPackages: ["", "", ""],
      faqs: [{ question: createEmptyLocalizedText("Is food included?"), answer: createEmptyLocalizedText("No, meals are not included.") }],

      // SEO
      metaTitle: createEmptyLocalizedText(),
      metaDescription: createEmptyLocalizedText(),
      keywords: createEmptyLocalizedText(),
      canonicalUrl: "",

      // Booking Info
      cancellation: createEmptyLocalizedText("Free cancellation up to 24 hours before."),
      refund: createEmptyLocalizedText("Full refund if cancelled in time."),
      pickup: createEmptyLocalizedText("Hotel lobby pick-up."),
      drop: createEmptyLocalizedText("Drop-off at hotel."),
      notes: createEmptyLocalizedText(),
      hideRate: false,
      badgeText: createEmptyLocalizedText(),
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setCoverImagePreviews([]);
    setCoverImageFiles([]);
    setAboutImagePreview(null);
    setAboutImageFile(null);
    setAboutImagePreviews([]);
    setAboutImageFiles([]);
    setOgImagePreview(null);
    setOgImageFile(null);
    setNewGalleryFiles([]);
    setActivePkgFormTab("general");
    setShowPackageModal(true);
  };

  const handleOpenEditPackage = (p: PackageItemData) => {
    setEditingPackage(p);
    setPackageForm({
      ...p,
      packageCategory: Array.isArray(p.packageCategory) ? p.packageCategory : p.packageCategory ? [p.packageCategory] : ["varkalaSightseeing"],
      relatedPackages: p.relatedPackages || ["", "", ""],
      badgeText: p.badgeText || createEmptyLocalizedText(),
    });
    setCoverImagePreview(p.image);
    setCoverImageFile(null);
    setCoverImagePreviews(p.images && p.images.length > 0 ? p.images : [p.image]);
    setCoverImageFiles([]);
    setAboutImagePreview(p.aboutImage);
    setAboutImageFile(null);
    setAboutImagePreviews(p.aboutImages && p.aboutImages.length > 0 ? p.aboutImages : p.aboutImage ? [p.aboutImage] : []);
    setAboutImageFiles([]);
    setOgImagePreview(p.ogImage || null);
    setOgImageFile(null);
    setNewGalleryFiles([]);
    setActivePkgFormTab("general");
    setShowPackageModal(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSavingPackage(true);

    try {
      const formData = new FormData();
      formData.append("packageCategory", JSON.stringify(packageForm.packageCategory || ["varkalaSightseeing"]));
      formData.append("slug", packageForm.slug || "");
      formData.append("price", String(packageForm.price || 0));
      formData.append("video", packageForm.video || "");
      formData.append("canonicalUrl", packageForm.canonicalUrl || "");

      formData.append("title", JSON.stringify(packageForm.title));
      formData.append("pricePeriod", JSON.stringify(packageForm.pricePeriod));
      formData.append("duration", JSON.stringify(packageForm.duration));
      formData.append("shortDescription", JSON.stringify(packageForm.shortDescription));
      formData.append("tagline", JSON.stringify(packageForm.tagline));
      formData.append("aboutText", JSON.stringify(packageForm.aboutText));

      formData.append("travelTime", JSON.stringify(packageForm.travelTime));
      formData.append("entryFee", JSON.stringify(packageForm.entryFee));
      formData.append("optionalCharges", JSON.stringify(packageForm.optionalCharges));
      formData.append("difficulty", JSON.stringify(packageForm.difficulty));
      formData.append("groupSize", JSON.stringify(packageForm.groupSize));
      formData.append("location", JSON.stringify(packageForm.location));

      formData.append("tourOverview", JSON.stringify(packageForm.tourOverview));
      formData.append("bestTime", JSON.stringify(packageForm.bestTime));
      formData.append("dressCode", JSON.stringify(packageForm.dressCode));
      formData.append("cta", JSON.stringify(packageForm.cta));

      formData.append("metaTitle", JSON.stringify(packageForm.metaTitle));
      formData.append("metaDescription", JSON.stringify(packageForm.metaDescription));
      formData.append("keywords", JSON.stringify(packageForm.keywords));

      formData.append("cancellation", JSON.stringify(packageForm.cancellation));
      formData.append("refund", JSON.stringify(packageForm.refund));
      formData.append("pickup", JSON.stringify(packageForm.pickup));
      formData.append("drop", JSON.stringify(packageForm.drop));
      formData.append("notes", JSON.stringify(packageForm.notes));

      formData.append("inclusions", JSON.stringify(packageForm.inclusions || []));
      formData.append("exclusions", JSON.stringify(packageForm.exclusions || []));
      formData.append("itinerary", JSON.stringify(packageForm.itinerary || []));
      formData.append("itineraryEvening", JSON.stringify(packageForm.itineraryEvening || []));
      formData.append("highlights", JSON.stringify(packageForm.highlights || []));
      formData.append("whyGuestsLoveUs", JSON.stringify(packageForm.whyGuestsLoveUs || []));
      formData.append("quickFacts", JSON.stringify(packageForm.quickFacts || []));
      formData.append("thingsToBring", JSON.stringify(packageForm.thingsToBring || []));
      formData.append("nearbyAttractions", JSON.stringify(packageForm.nearbyAttractions || []));
      const filteredRelated = (packageForm.relatedPackages || []).filter(Boolean);
      formData.append("relatedPackages", JSON.stringify(filteredRelated));
      formData.append("faqs", JSON.stringify(packageForm.faqs || []));
      formData.append("hideRate", String(packageForm.hideRate || false));
      formData.append("badgeText", JSON.stringify(packageForm.badgeText || createEmptyLocalizedText()));

      // Send which existing server images to keep (non-blob URLs)
      const existingImageUrls = coverImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingImages", JSON.stringify(existingImageUrls));
      // Append only new file uploads
      coverImageFiles.forEach(file => {
        formData.append("images", file);
      });

      // Send which existing about images to keep
      const existingAboutUrls = aboutImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingAboutImages", JSON.stringify(existingAboutUrls));
      // Append only new about image uploads
      aboutImageFiles.forEach(file => {
        formData.append("aboutImage", file);
      });
      if (ogImageFile) formData.append("ogImage", ogImageFile);

      // Append gallery uploads and existing links
      if (newGalleryFiles.length > 0) {
        newGalleryFiles.forEach((file) => {
          formData.append("gallery", file);
        });
      }
      formData.append("existingGallery", JSON.stringify(packageForm.gallery || []));

      const url = editingPackage
        ? `${API_BASE_URL}/api/packages/items/${editingPackage._id}`
        : `${API_BASE_URL}/api/packages/items`;
      const method = editingPackage ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowPackageModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save package");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPackage(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!token || !confirm("Delete this package?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/packages/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // YOGA (ITEMS) ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddYoga = (prefilledType?: string) => {
    setEditingYoga(null);
    setYogaForm({
      yogaType: prefilledType || "retreats",
      slug: "",
      price: 15000,
      title: createEmptyLocalizedText(),
      pricePeriod: createEmptyLocalizedText("/ program"),
      duration: createEmptyLocalizedText("7 Days"),
      shortDescription: createEmptyLocalizedText(),
      tagline: createEmptyLocalizedText(),
      aboutText: createEmptyLocalizedText(),
      inclusions: [createEmptyLocalizedText("Organic meals"), createEmptyLocalizedText("Standard accommodation")],
      benefits: [createEmptyLocalizedText("De-stress"), createEmptyLocalizedText("Enhanced clarity")],
      schedule: [
        { time: createEmptyLocalizedText("06:30 AM"), activity: createEmptyLocalizedText("Sunrise Flow") }
      ],
      relatedYoga: ["", "", ""],
      hideRate: false,
      metaTitle: createEmptyLocalizedText(),
      metaDescription: createEmptyLocalizedText(),
      keywords: createEmptyLocalizedText(),
      canonicalUrl: "",
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setCoverImagePreviews([]);
    setCoverImageFiles([]);
    setAboutImagePreview(null);
    setAboutImageFile(null);
    setAboutImagePreviews([]);
    setAboutImageFiles([]);
    setShowYogaModal(true);
  };

  const handleOpenEditYoga = (y: YogaItemData) => {
    setEditingYoga(y);
    setYogaForm({
      ...y,
      relatedYoga: y.relatedYoga || ["", "", ""]
    });
    setCoverImagePreview(y.image);
    setCoverImageFile(null);
    setCoverImagePreviews(y.images && y.images.length > 0 ? y.images : [y.image]);
    setCoverImageFiles([]);
    setAboutImagePreview(y.aboutImage);
    setAboutImageFile(null);
    setAboutImagePreviews(y.aboutImages && y.aboutImages.length > 0 ? y.aboutImages : y.aboutImage ? [y.aboutImage] : []);
    setAboutImageFiles([]);
    setShowYogaModal(true);
  };

  const handleSaveYoga = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSavingYoga(true);

    try {
      const formData = new FormData();
      formData.append("yogaType", yogaForm.yogaType || "retreats");
      formData.append("slug", yogaForm.slug || "");
      formData.append("price", String(yogaForm.price || 0));

      formData.append("title", JSON.stringify(yogaForm.title));
      formData.append("pricePeriod", JSON.stringify(yogaForm.pricePeriod));
      formData.append("duration", JSON.stringify(yogaForm.duration));
      formData.append("shortDescription", JSON.stringify(yogaForm.shortDescription));
      formData.append("tagline", JSON.stringify(yogaForm.tagline));
      formData.append("aboutText", JSON.stringify(yogaForm.aboutText));

      formData.append("metaTitle", JSON.stringify(yogaForm.metaTitle));
      formData.append("metaDescription", JSON.stringify(yogaForm.metaDescription));
      formData.append("keywords", JSON.stringify(yogaForm.keywords));
      formData.append("canonicalUrl", yogaForm.canonicalUrl || "");

      formData.append("inclusions", JSON.stringify(yogaForm.inclusions || []));
      formData.append("benefits", JSON.stringify(yogaForm.benefits || []));
      formData.append("schedule", JSON.stringify(yogaForm.schedule || []));

      const filteredRelated = (yogaForm.relatedYoga || []).filter(Boolean);
      formData.append("relatedYoga", JSON.stringify(filteredRelated));
      formData.append("hideRate", String(yogaForm.hideRate || false));

      // Send which existing server images to keep (non-blob URLs)
      const existingImageUrls = coverImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingImages", JSON.stringify(existingImageUrls));
      // Append only new file uploads
      coverImageFiles.forEach(file => {
        formData.append("images", file);
      });

      // Send which existing about images to keep
      const existingAboutUrls = aboutImagePreviews.filter(u => !u.startsWith("blob:"));
      formData.append("existingAboutImages", JSON.stringify(existingAboutUrls));
      // Append only new about image uploads
      aboutImageFiles.forEach(file => {
        formData.append("aboutImage", file);
      });

      const url = editingYoga
        ? `${API_BASE_URL}/api/yoga/items/${editingYoga._id}`
        : `${API_BASE_URL}/api/yoga/items`;
      const method = editingYoga ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowYogaModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save retreat");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingYoga(false);
    }
  };

  const handleDeleteRetreat = async (id: string) => {
    if (!token || !confirm("Delete this retreat program? This cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/retreats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteYoga = async (id: string) => {
    if (!token || !confirm("Delete this yoga program?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------------------------------------------------------
  // TEACHERS ACTIONS
  // ------------------------------------------------------------------
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherForm({
      name: "",
      role: createEmptyLocalizedText(),
      bio: createEmptyLocalizedText()
    });
    setCoverImagePreview(null);
    setCoverImageFile(null);
    setShowTeacherModal(true);
  };

  const handleOpenEditTeacher = (t: TeacherData) => {
    setEditingTeacher(t);
    setTeacherForm({ ...t });
    setCoverImagePreview(t.image);
    setCoverImageFile(null);
    setShowTeacherModal(true);
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSavingTeacher(true);

    try {
      const formData = new FormData();
      formData.append("name", teacherForm.name || "");
      formData.append("role", JSON.stringify(teacherForm.role));
      formData.append("bio", JSON.stringify(teacherForm.bio));

      if (coverImageFile) formData.append("image", coverImageFile);

      const url = editingTeacher
        ? `${API_BASE_URL}/api/yoga/teachers/${editingTeacher._id}`
        : `${API_BASE_URL}/api/yoga/teachers`;
      const method = editingTeacher ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setShowTeacherModal(false);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save teacher profiles");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!token || !confirm("Delete this teacher?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/yoga/teachers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete gallery item.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!galleryFile) {
      alert("Please choose an image file to upload.");
      return;
    }
    setIsUploadingGallery(true);

    try {
      const formData = new FormData();
      formData.append("image", galleryFile);
      formData.append("category", galleryForm.category);
      formData.append("caption", JSON.stringify(galleryForm.caption));
      formData.append("displayOrder", String(galleryItems.length));

      const res = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setShowGalleryModal(false);
        setGalleryFile(null);
        setGalleryFilePreview(null);
        setGalleryForm({ category: "villa-accommodation", caption: { en: "", de: "", fr: "", ru: "" }, displayOrder: 0 });
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to upload gallery image.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload gallery image.");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleUpdateGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingGalleryItem) return;
    setIsUpdatingGallery(true);

    try {
      const formData = new FormData();
      if (editGalleryFile) {
        formData.append("image", editGalleryFile);
      }
      formData.append("category", editingGalleryItem.category);
      formData.append("caption", JSON.stringify(editingGalleryItem.caption));
      formData.append("displayOrder", String(editingGalleryItem.displayOrder || 0));

      const res = await fetch(`${API_BASE_URL}/api/gallery/${editingGalleryItem._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        setShowEditGalleryModal(false);
        setEditingGalleryItem(null);
        setEditGalleryFile(null);
        setEditGalleryFilePreview(null);
        fetchData();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update gallery item.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update gallery item.");
    } finally {
      setIsUpdatingGallery(false);
    }
  };

  const handleMoveGalleryItem = async (currentItem: any, direction: "left" | "right") => {
    if (!token) return;
    const idx = galleryItems.findIndex(item => item._id === currentItem._id);
    if (idx === -1) return;

    let targetIdx = direction === "left" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= galleryItems.length) return;

    const targetItem = galleryItems[targetIdx];

    // Optimistically update UI instantly
    const updatedItems = [...galleryItems];
    updatedItems[idx] = targetItem;
    updatedItems[targetIdx] = currentItem;
    setGalleryItems(updatedItems);

    let curOrder = currentItem.displayOrder !== undefined ? currentItem.displayOrder : idx;
    let targetOrder = targetItem.displayOrder !== undefined ? targetItem.displayOrder : targetIdx;

    if (curOrder === targetOrder) {
      if (direction === "left") {
        curOrder = targetOrder - 1;
      } else {
        curOrder = targetOrder + 1;
      }
    } else {
      const temp = curOrder;
      curOrder = targetOrder;
      targetOrder = temp;
    }

    try {
      await Promise.all([
        fetch(`${API_BASE_URL}/api/gallery/${currentItem._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ displayOrder: curOrder })
        }),
        fetch(`${API_BASE_URL}/api/gallery/${targetItem._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ displayOrder: targetOrder })
        })
      ]);
    } catch (err) {
      console.error(err);
      fetchData(); // Fallback to database sync if fetch fails
    }
  };

  // Save homepage static text edits
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepageData || !token) return;
    setSavingHomepage(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/homepage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(homepageData),
      });

      if (res.ok) {
        setShowHomepageModal(false);
        fetchData();
      } else {
        alert("Failed to save homepage changes.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving homepage content.");
    } finally {
      setSavingHomepage(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#2d3748] flex select-none font-sans overflow-x-hidden relative">

      {/* MOBILE OVERLAY */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-[280px] bg-[#121212] text-white flex flex-col justify-between shrink-0 border-r border-white/5 z-40 transition-transform duration-300 ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <div className="relative flex items-center justify-center w-8 h-8 border border-brand-gold/30 rounded-sm bg-black/40">
              <svg width="18" height="18" viewBox="0 0 40 40" fill="none" className="text-brand-gold">
                <path d="M20 5L6 16V33H34V16L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-sm tracking-[0.15em] text-white uppercase font-bold leading-none">VILLA LEMON</h2>
              <span className="text-[7px] tracking-[0.25em] text-brand-gold uppercase font-medium mt-1 block">CMS Dashboard</span>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1 text-[11px] font-semibold tracking-wider uppercase text-gray-400">
            <div 
              onClick={() => setActiveTab("dashboard")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "dashboard" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard Overview</span>
            </div>

            <div className="text-[9px] font-bold text-gray-600 tracking-[0.2em] mt-5 mb-2 px-3">
              Content Managers
            </div>
            
            <div 
              onClick={() => setActiveTab("stays")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "stays" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Home className="w-4 h-4 text-brand-gold" />
              <span>Villas & Stays</span>
            </div>

            <div 
              onClick={() => setActiveTab("packages")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "packages" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4 text-brand-gold" />
              <span>Tour Packages</span>
            </div>

            <div 
              onClick={() => setActiveTab("yoga")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "yoga" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4 text-brand-gold" />
              <span>Yoga Programs</span>
            </div>

            <div 
              onClick={() => setActiveTab("teachers")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "teachers" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Smile className="w-4 h-4 text-brand-gold" />
              <span>Yoga Teachers</span>
            </div>

            <div 
              onClick={() => setActiveTab("gallery")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "gallery" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Camera className="w-4 h-4 text-brand-gold" />
              <span>Gallery</span>
            </div>

            <div 
              onClick={() => setActiveTab("enquiries")}
              className={`px-3.5 py-3 rounded-sm flex items-center gap-3 cursor-pointer transition-colors ${
                activeTab === "enquiries" ? "bg-[#c5a880]/10 text-brand-gold border-l-2 border-brand-gold" : "hover:bg-white/5 hover:text-white"
              }`}
            >
              <Mail className="w-4 h-4 text-brand-gold" />
              <span>Enquiries & Messages</span>
            </div>

            <div 
              onClick={() => {
                if (homepageData) setShowHomepageModal(true);
              }}
              className="px-3.5 py-3 hover:bg-white/5 hover:text-white rounded-sm flex items-center gap-3 cursor-pointer transition-colors"
            >
              <FileText className="w-4 h-4 text-brand-gold/80" />
              <span>Landing Page Texts</span>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full bg-brand-gold flex items-center justify-center font-bold text-[#121212]">
              <span className="text-sm">AD</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white leading-tight">{adminUser?.name || "Admin"}</span>
              <span className="text-[9px] text-gray-500">{adminUser?.email || "admin@villalemon.com"}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 hover:bg-white/5 text-gray-500 hover:text-red-400 rounded-sm transition-colors duration-200"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-grow flex flex-col min-w-0 lg:pl-0">

        {/* MOBILE TOP BAR */}
        <div className="lg:hidden bg-[#121212] text-white px-4 py-3 flex items-center justify-between shrink-0 z-20 sticky top-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-sm hover:bg-white/10 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none" className="text-brand-gold">
              <path d="M20 5L6 16V33H34V16L20 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-serif text-sm tracking-widest text-white uppercase font-bold">VILLA LEMON</span>
          </div>
          <a href="/" target="_blank" className="p-2 rounded-sm hover:bg-white/10 text-brand-gold">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <header className="hidden lg:flex bg-white border-b border-gray-200 px-8 py-4 items-center justify-between relative z-10 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-none">CMS Dashboard Workspace</h1>
            <p className="text-xs text-gray-500 mt-1.5">Manage stays details, packages itinerary days, and yoga wellness retreats.</p>
          </div>
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-gray-700 hover:text-brand-gold uppercase border border-gray-200 hover:border-brand-gold px-3.5 py-2 rounded-sm transition-all duration-300 bg-white shadow-sm"
          >
            <span>View Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px]">
          
          {/* ANALYTICS SUMMARY BOXES */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8 select-none">
            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("stays")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Total Stays</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{stays.length}</h3>
                <span className="text-[10px] font-semibold text-green-500 mt-1 block">Dynamic rooms/villas</span>
              </div>
              <div className="w-12 h-12 bg-green-50 flex items-center justify-center rounded-full text-green-500">
                <Home className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("packages")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Packages</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{packages.length}</h3>
                <span className="text-[10px] font-semibold text-amber-500 mt-1 block">Sightseeing & tours</span>
              </div>
              <div className="w-12 h-12 bg-amber-50 flex items-center justify-center rounded-full text-amber-500">
                <Compass className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("yoga")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Yoga Programs</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{retreats.length + yogas.length}</h3>
                <span className="text-[10px] font-semibold text-indigo-500 mt-1 block">Retreats & classes</span>
              </div>
              <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-500">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-md shadow-sm flex items-center justify-between cursor-pointer" onClick={() => setActiveTab("teachers")}>
              <div>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Teachers</span>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{teachers.length}</h3>
                <span className="text-[10px] font-semibold text-rose-500 mt-1 block">Certified profiles</span>
              </div>
              <div className="w-12 h-12 bg-rose-50 flex items-center justify-center rounded-full text-rose-500">
                <Smile className="w-5 h-5" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
              <span>Fetching CMS data records...</span>
            </div>
          ) : (
            <div className="animate-fade-in space-y-8">
              
              {/* TAB: DASHBOARD OVERVIEW */}
              {activeTab === "dashboard" && (
                <div className="bg-white border border-gray-200 rounded-md p-6 shadow-sm select-text text-left">
                  <h3 className="font-serif text-lg font-semibold text-gray-800 mb-4">Welcome to Villa Lemon CMS Panel</h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-4">
                    Use the sidebar on the left to navigate between different content tables. You can edit subgroup category definitions (Entire Villas, Sightseeing Packages, Yoga retreat programs), add properties inside them, check landmarks, and upload cover photos optimized via Cloudinary.
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Changes made here are applied instantly to public pages. Direct Cloudinary image optimization handles thumbnail formatting automatically.
                  </p>
                </div>
              )}

              {/* TAB: STAYS MANAGER */}
              {activeTab === "stays" && (
                <div className="space-y-10">
                  {/* CATEGORIES SECTION */}
                  <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                      <div className="text-left">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Accommodation Categories (Subgroups)</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure layout, cover photos, and starting prices for the main stays sections.</p>
                      </div>
                      <button
                        onClick={() => handleOpenAddSubgroup("accommodation")}
                        className="self-start sm:self-auto flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Subgroup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {accommodationCategories.map((cat, index) => {
                        const catStays = stays.filter(s => s.accommodationType === cat.type);
                        
                        return (
                          <div key={cat._id} className="border border-gray-200 rounded p-4 bg-gray-50 text-left flex flex-col justify-between">
                            <div>
                              <div className="relative w-full aspect-[2/1] rounded overflow-hidden mb-3 bg-gray-100">
                                <img src={cat.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#121212]">{cat.title[activeLangTab]}</h4>
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                                type: {cat.type} • Price: {cat.price[activeLangTab]}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-2 font-light line-clamp-3 font-sans">{cat.description[activeLangTab]}</p>
                              
                              {/* Subgroup items list inside */}
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Properties inside ({catStays.length})</span>
                                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                                  {catStays.map((item, itemIdx) => (
                                    <div key={item._id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-150">
                                      <span className="font-medium truncate mr-2">{item.title[activeLangTab]}</span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => moveProgramItem("accommodationItem", itemIdx, "up", cat.type)}
                                          disabled={itemIdx === 0}
                                          className="text-gray-500 hover:text-brand-gold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                          title="Move Up"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => moveProgramItem("accommodationItem", itemIdx, "down", cat.type)}
                                          disabled={itemIdx === catStays.length - 1}
                                          className="text-gray-500 hover:text-brand-gold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                          title="Move Down"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleOpenEditStay(item)} className="text-gray-500 hover:text-brand-gold transition-colors"><Edit2 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeleteStay(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-200 justify-between">
                              <button
                                onClick={() => handleOpenAddStay(cat.type)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Stay</span>
                              </button>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveSubgroup("accommodation", index, "up")}
                                  disabled={index === 0}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => moveSubgroup("accommodation", index, "down")}
                                  disabled={index === accommodationCategories.length - 1}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditSubgroup(cat, "accommodation")}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors"
                                  title="Edit Subgroup Details"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubgroup(cat._id, "accommodation")}
                                  className="p-1.5 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PACKAGES MANAGER */}
              {activeTab === "packages" && (
                <div className="space-y-6 sm:space-y-10">
                  <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                      <div className="text-left">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Tour Package Categories (Subgroups)</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure layout and descriptions for your sightseeing, houseboat, and local tours categories.</p>
                      </div>
                      <button
                        onClick={() => handleOpenAddSubgroup("package")}
                        className="self-start sm:self-auto flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Subgroup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {packageCategories.map((cat, index) => {
                        const catPkgs = packages.filter(p => Array.isArray(p.packageCategory) ? p.packageCategory.includes(cat.category as any) : p.packageCategory === cat.category);
                        
                        return (
                          <div key={cat._id} className="border border-gray-200 rounded p-4 bg-gray-50 text-left flex flex-col justify-between">
                            <div>
                              <div className="relative w-full aspect-[2/1] rounded overflow-hidden mb-3 bg-gray-100">
                                <img src={cat.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#121212]">{cat.title[activeLangTab]}</h4>
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                                category: {cat.category}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-2 font-light line-clamp-3 font-sans">{cat.description[activeLangTab]}</p>
                              
                              {/* Subgroup items list inside */}
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Packages inside ({catPkgs.length})</span>
                                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                                  {catPkgs.map((item, itemIdx) => (
                                    <div key={item._id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-150">
                                      <span className="font-medium truncate mr-2">{item.title[activeLangTab]}</span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => moveProgramItem("packageItem", itemIdx, "up", cat.category)}
                                          disabled={itemIdx === 0}
                                          className="text-gray-500 hover:text-brand-gold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                          title="Move Up"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>
                                        <button
                                          onClick={() => moveProgramItem("packageItem", itemIdx, "down", cat.category)}
                                          disabled={itemIdx === catPkgs.length - 1}
                                          className="text-gray-500 hover:text-brand-gold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                          title="Move Down"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                        <button onClick={() => handleOpenEditPackage(item)} className="text-gray-500 hover:text-brand-gold transition-colors"><Edit2 className="w-3 h-3" /></button>
                                        <button onClick={() => handleDeletePackage(item._id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3 h-3" /></button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-200 justify-between">
                              <button
                                onClick={() => handleOpenAddPackage(cat.category)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Package</span>
                              </button>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveSubgroup("package", index, "up")}
                                  disabled={index === 0}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => moveSubgroup("package", index, "down")}
                                  disabled={index === packageCategories.length - 1}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditSubgroup(cat, "package")}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubgroup(cat._id, "package")}
                                  className="p-1.5 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: YOGA RETREATS MANAGER */}
              {activeTab === "yoga" && (
                <div className="space-y-6 sm:space-y-10">
                  <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                      <div className="text-left">
                        <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Yoga Program Categories (Subgroups)</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure layout, cover banners, and details for retreats, daily flow classes, and private sessions.</p>
                      </div>
                      <button
                        onClick={() => handleOpenAddSubgroup("yoga")}
                        className="self-start sm:self-auto flex items-center gap-1 bg-[#121212] hover:bg-brand-gold text-white hover:text-black font-bold uppercase tracking-wider text-[9px] px-3.5 py-2.5 rounded-sm transition-all duration-300 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Subgroup</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {yogaCategories.map((cat, index) => {
                        const isRetreat = cat.template === "retreats" || cat.type === "retreats";
                        const catYogas = isRetreat 
                          ? retreats.filter(r => (r.yogaType || "retreats") === cat.type) 
                          : yogas.filter(y => y.yogaType === cat.type);
                        
                        return (
                          <div key={cat._id} className="border border-gray-200 rounded p-4 bg-gray-50 text-left flex flex-col justify-between">
                            <div>
                              <div className="relative w-full aspect-[2/1] rounded overflow-hidden mb-3 bg-gray-100">
                                <img src={cat.image} className="w-full h-full object-cover" alt="" />
                              </div>
                              <h4 className="font-serif font-bold text-base text-[#121212]">{cat.title[activeLangTab]}</h4>
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                                type: {cat.type}
                              </span>
                              <p className="text-[11px] text-gray-500 mt-2 font-light line-clamp-3 font-sans">{cat.description[activeLangTab]}</p>
                              
                              {/* Subgroup items list inside */}
                              <div className="mt-4 pt-3 border-t border-gray-200">
                                <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Programs inside ({catYogas.length})</span>
                                <div className="space-y-1.5 mt-2 max-h-36 overflow-y-auto pr-1">
                                  {catYogas.map((item, itemIdx) => {
                                    const displayTitle = isRetreat ? (item.heroTitle?.[activeLangTab] || item.heroTitle?.en || "") : item.title[activeLangTab];
                                    return (
                                      <div key={item._id} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-gray-150">
                                        <span className="font-medium truncate mr-2">{displayTitle}</span>
                                        <div className="flex gap-1">
                                          <button
                                            onClick={() => moveProgramItem(isRetreat ? "retreat" : "yogaItem", itemIdx, "up", cat.type)}
                                            disabled={itemIdx === 0}
                                            className="text-gray-500 hover:text-brand-gold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                            title="Move Up"
                                          >
                                            <ArrowUp className="w-3 h-3" />
                                          </button>
                                          <button
                                            onClick={() => moveProgramItem(isRetreat ? "retreat" : "yogaItem", itemIdx, "down", cat.type)}
                                            disabled={itemIdx === catYogas.length - 1}
                                            className="text-gray-500 hover:text-brand-gold transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                                            title="Move Down"
                                          >
                                            <ArrowDown className="w-3 h-3" />
                                          </button>
                                          <button 
                                            onClick={() => {
                                              if (isRetreat) {
                                                setEditingRetreat(item);
                                                setShowRetreatModal(true);
                                              } else {
                                                handleOpenEditYoga(item);
                                              }
                                            }} 
                                            className="text-gray-500 hover:text-brand-gold transition-colors cursor-pointer"
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button 
                                            onClick={() => {
                                              if (isRetreat) {
                                                handleDeleteRetreat(item._id);
                                              } else {
                                                handleDeleteYoga(item._id);
                                              }
                                            }} 
                                            className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-5 pt-3 border-t border-gray-200 justify-between">
                              <button
                                onClick={() => {
                                  if (isRetreat) {
                                    setSelectedYogaType(cat.type);
                                    setEditingRetreat(null);
                                    setShowRetreatModal(true);
                                  } else {
                                    handleOpenAddYoga(cat.type);
                                  }
                                }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-[#121212] hover:bg-brand-gold text-white hover:text-black rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Program</span>
                              </button>
                              
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveSubgroup("yoga", index, "up")}
                                  disabled={index === 0}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => moveSubgroup("yoga", index, "down")}
                                  disabled={index === yogaCategories.length - 1}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditSubgroup(cat, "yoga")}
                                  className="p-1.5 border border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold rounded-sm transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubgroup(cat._id, "yoga")}
                                  className="p-1.5 border border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 rounded-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: YOGA TEACHERS */}
              {activeTab === "teachers" && (
                <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-6">
                    <div className="text-left">
                      <h3 className="font-serif text-base sm:text-lg font-semibold text-gray-800">Yoga Teachers Directory</h3>
                      <p className="text-xs text-gray-500 mt-1">Manage profiles and bios of your certified yoga acharyas.</p>
                    </div>
                    <button
                      onClick={handleOpenAddTeacher}
                      className="self-start sm:self-auto flex items-center gap-1 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-sm transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Teacher</span>
                    </button>
                  </div>

                  {teachers.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">No teachers seeded.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {teachers.map((teacher) => (
                        <div key={teacher._id} className="border border-gray-200 rounded-md p-5 bg-white shadow-sm flex items-start gap-4">
                          <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200 bg-gray-50 shrink-0 select-none">
                            <img src={teacher.image} alt={teacher.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow min-w-0 text-left">
                            <h4 className="font-serif font-bold text-base text-gray-800 leading-tight truncate">{teacher.name}</h4>
                            <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block mt-1">{teacher.role.en}</span>
                            <p className="text-[11px] text-gray-500 font-light mt-2 line-clamp-3">{teacher.bio.en}</p>
                            
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 justify-end w-full">
                              <button
                                onClick={() => handleOpenEditTeacher(teacher)}
                                className="px-2.5 py-1.5 border border-gray-200 text-gray-700 hover:text-brand-gold hover:border-brand-gold rounded-sm transition-colors text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteTeacher(teacher._id)}
                                className="p-1.5 border border-gray-200 text-gray-400 hover:text-red-500 rounded-sm"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "enquiries" && (
                <EnquiriesTab 
                  enquiries={enquiries}
                  token={token}
                  onRefresh={fetchData}
                />
              )}

              {activeTab === "gallery" && (
                <div className="bg-white p-6 rounded-md shadow-xs border border-gray-200">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-150">
                    <div className="text-left">
                      <h2 className="text-xl font-serif font-normal text-brand-dark">Gallery Management</h2>
                      <p className="text-xs text-gray-500 mt-1">Add, update, and manage global photo gallery items across different categories.</p>
                    </div>
                    <button
                      onClick={() => {
                        setGalleryFile(null);
                        setGalleryFilePreview(null);
                        setGalleryForm({ category: "villa-accommodation", caption: { en: "", de: "", fr: "", ru: "" }, displayOrder: 0 });
                        setShowGalleryModal(true);
                      }}
                      className="px-4 py-2 bg-brand-dark hover:bg-brand-dark-soft text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Image</span>
                    </button>
                  </div>

                  {/* GALLERY ITEMS GRID LIST */}
                  {galleryItems.length === 0 ? (
                    <div className="py-20 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-300 rounded-sm">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm font-medium">No gallery items uploaded yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {galleryItems.map((item) => (
                        <div key={item._id} className="group relative border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex flex-col shadow-xs">
                          {/* Image */}
                          <div className="relative aspect-[4/3] w-full bg-gray-200">
                            <img
                              src={item.image}
                              alt={item.caption?.en || ""}
                              className="object-cover w-full h-full"
                            />
                            {/* Actions Overlay */}
                            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-white/90 p-1 rounded-sm border border-gray-200 shadow-xs">
                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingGalleryItem({
                                    _id: item._id,
                                    category: item.category,
                                    caption: {
                                      en: item.caption?.en || "",
                                      de: item.caption?.de || "",
                                      fr: item.caption?.fr || "",
                                      ru: item.caption?.ru || ""
                                    },
                                    displayOrder: item.displayOrder || 0
                                  });
                                  setEditGalleryFile(null);
                                  setEditGalleryFilePreview(item.image);
                                  setShowEditGalleryModal(true);
                                }}
                                className="p-1 hover:bg-brand-gold/20 text-gray-600 hover:text-brand-dark rounded-xs transition-colors cursor-pointer"
                                title="Edit Item"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteGalleryItem(item._id)}
                                className="p-1 hover:bg-red-500 hover:text-white border border-transparent text-gray-500 rounded-xs transition-colors cursor-pointer"
                                title="Delete Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {/* Category badge */}
                            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-[#0f2c1b]/95 text-white text-[8px] font-bold uppercase tracking-wider rounded-xs">
                              {item.category.replace("-", " & ")}
                            </span>
                          </div>
                          {/* Details */}
                          <div className="p-3.5 flex flex-col flex-grow bg-white text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider">
                                Order: {item.displayOrder || 0}
                              </span>
                              {/* Left/Right ordering buttons */}
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleMoveGalleryItem(item, "left")}
                                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-brand-dark rounded-xs transition-colors cursor-pointer"
                                  title="Move Left"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleMoveGalleryItem(item, "right")}
                                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-brand-dark rounded-xs transition-colors cursor-pointer"
                                  title="Move Right"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 font-light mt-1.5 leading-relaxed line-clamp-2">
                              {item.caption?.en || <em className="text-gray-400">No caption</em>}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <RetreatsTab
                token={token || ""}
                modalMode={true}
                isOpen={showRetreatModal}
                onClose={() => setShowRetreatModal(false)}
                onSave={() => {
                  setShowRetreatModal(false);
                  fetchData();
                }}
                editingItem={editingRetreat}
                defaultYogaType={selectedYogaType}
              />

            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          MODAL: SUBGROUP CATEGORY CREATOR / EDITOR
      ======================================================== */}
      {showSubgroupModal && subgroupForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-none sm:rounded-md max-w-4xl w-full h-screen sm:h-auto sm:max-h-[85vh] flex flex-col shadow-2xl border-0 sm:border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingSubgroup ? `Edit Subgroup Category Details` : `Create New Subgroup Category`}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure layout, translations, and cover photo</p>
              </div>
              <button onClick={() => setShowSubgroupModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            {subgroupFormType === "yoga" && subgroupForm.type === "host retreat" && (
              <div className="px-6 py-2 border-b border-gray-150 bg-[#fbf9f6] flex flex-wrap gap-1.5 select-none">
                {(["general", "features", "experience-faqs", "rooms", "meals", "logistics", "policies", "cancellation"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setHostRetreatTab(tab)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all ${
                      hostRetreatTab === tab ? "bg-[#121212] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {tab === "general" ? "1. General Info" : tab === "features" ? "2. Highlight Features" : tab === "experience-faqs" ? "3. Experience & FAQs" : tab === "rooms" ? "4. Rooms Layout" : tab === "meals" ? "5. Meals & Menus" : tab === "logistics" ? "6. Logistics & Extras" : tab === "policies" ? "7. Booking Policies" : "8. Cancellation Policy"}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSaveSubgroup} className="flex-grow overflow-y-auto p-6 space-y-5 text-xs">
              
              {/* ----------------------------------------------------
                  HOST RETREAT SPECIAL TABBED CONTENT
              ---------------------------------------------------- */}
              {subgroupFormType === "yoga" && subgroupForm.type === "host retreat" ? (
                <div className="space-y-5">
                  
                  {/* TAB 1: GENERAL INFO */}
                  {hostRetreatTab === "general" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Subgroup Type</label>
                          <select
                            value={subgroupForm.type || "host retreat"}
                            onChange={(e) => setSubgroupForm({ ...subgroupForm, type: e.target.value })}
                            className="border p-2.5 rounded bg-white"
                          >
                            <option value="host retreat">Host Your Yoga Retreat</option>
                            <option value="retreats">Yoga Retreats</option>
                            <option value="classes">Daily Yoga Classes</option>
                            <option value="private">Private Yoga Sessions</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Href Target Path</label>
                          <input
                            type="text"
                            value={subgroupForm.href || ""}
                            onChange={(e) => setSubgroupForm({ ...subgroupForm, href: e.target.value })}
                            placeholder="/yoga/Host-Your-Yoga-Retreat"
                            className="border p-2.5 rounded"
                            required
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                        <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                          Page Meta — Nav Card ({activeLangTab.toUpperCase()})
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Nav Card Title</label>
                            <input
                              type="text"
                              value={subgroupForm.title?.[activeLangTab] || ""}
                              onChange={(e) => {
                                const title = { ...subgroupForm.title, [activeLangTab]: e.target.value };
                                setSubgroupForm({ ...subgroupForm, title });
                              }}
                              className="border p-2.5 rounded"
                              required={activeLangTab === "en"}
                            />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Explore Link Title</label>
                            <input
                              type="text"
                              value={subgroupForm.explore?.[activeLangTab] || ""}
                              onChange={(e) => {
                                const explore = { ...subgroupForm.explore, [activeLangTab]: e.target.value };
                                setSubgroupForm({ ...subgroupForm, explore });
                              }}
                              placeholder="Explore"
                              className="border p-2.5 rounded"
                              required={activeLangTab === "en"}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Nav Card Description</label>
                          <textarea
                            rows={3}
                            value={subgroupForm.description?.[activeLangTab] || ""}
                            onChange={(e) => {
                              const description = { ...subgroupForm.description, [activeLangTab]: e.target.value };
                              setSubgroupForm({ ...subgroupForm, description });
                            }}
                            className="border p-2.5 rounded font-sans"
                            required={activeLangTab === "en"}
                          />
                        </div>
                      </div>

                      {/* ── HERO / INTRO SECTION ── */}
                      <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                        <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                          Hero Section — "Exclusive Group Retreat Venue" ({activeLangTab.toUpperCase()})
                        </h4>
                        <p className="text-[10px] text-gray-500">This controls the eyebrow label, main heading, and intro paragraph at the top of the Host Your Retreat page.</p>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Eyebrow Label</label>
                          <input
                            type="text"
                            value={getRetreatConfigVal("retreatVenue")}
                            onChange={(e) => setRetreatConfigVal("retreatVenue", e.target.value)}
                            placeholder="e.g. Exclusive Group Retreat Venue"
                            className="border p-2.5 rounded text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Main Heading</label>
                          <input
                            type="text"
                            value={getRetreatConfigVal("hostTitle")}
                            onChange={(e) => setRetreatConfigVal("hostTitle", e.target.value)}
                            placeholder="e.g. Host Your Retreat at Villa Lemon"
                            className="border p-2.5 rounded text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Intro Paragraph</label>
                          <textarea
                            rows={4}
                            value={getRetreatConfigVal("hostIntro")}
                            onChange={(e) => setRetreatConfigVal("hostIntro", e.target.value)}
                            placeholder="We provide private, premium homestay accommodation..."
                            className="border p-2.5 rounded font-sans text-xs"
                          />
                        </div>
                      </div>

                      {/* Cover Image Upload */}
                      <div className="space-y-2">
                        <label className="font-bold text-gray-600 uppercase">Cover Banner Image(s) (Upload multiple for slideshow)</label>
                        <div className="flex flex-col gap-3">
                          {coverImagePreviews && coverImagePreviews.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {coverImagePreviews.map((url, idx) => (
                                <div key={idx} className="relative w-24 aspect-[2/1] rounded border overflow-hidden shrink-0 bg-gray-50 group">
                                  <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCoverImage(idx)}
                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                    title="Remove image"
                                  >×</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                            <Upload className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold text-gray-500">Upload Banner Image(s)</span>
                            <input type="file" accept="image/*" multiple onChange={handleCoverImageChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: ROOMS LAYOUT */}
                  {hostRetreatTab === "rooms" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h4 className="font-bold text-[#121212] uppercase tracking-wider">
                          Rooms Configuration
                        </h4>
                        {!showRoomForm && (
                          <button
                            type="button"
                            onClick={handleAddRoomClick}
                            className="bg-[#121212] hover:bg-black text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider"
                          >
                            + Add Room
                          </button>
                        )}
                      </div>

                      {showRoomForm && editingRoomIndex !== null ? (
                        <div className="bg-white border rounded p-4 space-y-4">
                          <h5 className="font-bold text-gray-700 uppercase tracking-wider pb-1 border-b">
                            {subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.number ? `Edit Room ${subgroupForm.hostRetreatConfig.rooms[editingRoomIndex].number}` : "New Room"}
                          </h5>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-gray-600 uppercase text-[10px]">Room Number / ID</label>
                              <input
                                type="text"
                                value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.number || ""}
                                onChange={(e) => handleRoomFieldChange("number", e.target.value)}
                                className="border p-2 rounded text-xs"
                                placeholder="e.g. 101"
                                required
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-gray-600 uppercase text-[10px]">Phase</label>
                              <select
                                value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.phase || 1}
                                onChange={(e) => handleRoomFieldChange("phase", parseInt(e.target.value))}
                                className="border p-2 rounded bg-white text-xs"
                              >
                                <option value={1}>Phase 1 (Non AC)</option>
                                <option value={2}>Phase 2 (AC Included)</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1 justify-center pt-4">
                              <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600 text-[10px] uppercase">
                                <input
                                  type="checkbox"
                                  checked={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.ac || false}
                                  onChange={(e) => handleRoomFieldChange("ac", e.target.checked)}
                                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-gray-300"
                                />
                                Air Conditioning
                              </label>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-3 rounded space-y-3">
                            <h6 className="font-bold text-gray-700 text-[10px] uppercase border-b pb-1">
                              Room details in active language: ({activeLangTab.toUpperCase()})
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-505 uppercase text-[9px]">Category Name</label>
                                <input
                                  type="text"
                                  value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.category?.[activeLangTab] || ""}
                                  onChange={(e) => handleRoomFieldChange("category", e.target.value, activeLangTab)}
                                  className="border p-2 rounded text-xs bg-white"
                                  placeholder="e.g. Deluxe Room with Balcony"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-505 uppercase text-[9px]">Beds Setup</label>
                                <input
                                  type="text"
                                  value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.beds?.[activeLangTab] || ""}
                                  onChange={(e) => handleRoomFieldChange("beds", e.target.value, activeLangTab)}
                                  className="border p-2 rounded text-xs bg-white"
                                  placeholder="e.g. 1 Large Bed or 2 Single Beds"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-505 uppercase text-[9px]">Balcony Info</label>
                                <input
                                  type="text"
                                  value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.balcony?.[activeLangTab] || ""}
                                  onChange={(e) => handleRoomFieldChange("balcony", e.target.value, activeLangTab)}
                                  className="border p-2 rounded text-xs bg-white"
                                  placeholder="e.g. Small private balcony"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-505 uppercase text-[9px]">Wardrobe</label>
                                <input
                                  type="text"
                                  value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.wardrobe?.[activeLangTab] || ""}
                                  onChange={(e) => handleRoomFieldChange("wardrobe", e.target.value, activeLangTab)}
                                  className="border p-2 rounded text-xs bg-white"
                                  placeholder="e.g. Closed Wardrobe"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-505 uppercase text-[9px]">Bathroom</label>
                                <input
                                  type="text"
                                  value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.bathroom?.[activeLangTab] || ""}
                                  onChange={(e) => handleRoomFieldChange("bathroom", e.target.value, activeLangTab)}
                                  className="border p-2 rounded text-xs bg-white"
                                  placeholder="e.g. Attached"
                                />
                              </div>
                              <div className="flex flex-col gap-1">
                                <label className="font-bold text-gray-505 uppercase text-[9px]">Hot Water</label>
                                <input
                                  type="text"
                                  value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.hotWater?.[activeLangTab] || ""}
                                  onChange={(e) => handleRoomFieldChange("hotWater", e.target.value, activeLangTab)}
                                  className="border p-2 rounded text-xs bg-white"
                                  placeholder="e.g. Geyser System"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="font-bold text-gray-505 uppercase text-[9px]">Special Notes</label>
                              <input
                                type="text"
                                value={subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.notes?.[activeLangTab] || ""}
                                onChange={(e) => handleRoomFieldChange("notes", e.target.value, activeLangTab)}
                                className="border p-2 rounded text-xs bg-white"
                                placeholder="e.g. Recommended for single occupancy"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="font-bold text-gray-600 uppercase text-[10px]">Room Images (Slideshow)</label>
                            
                            <div className="flex flex-wrap gap-2">
                              {(subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.images || []).map((url: string, imgIdx: number) => (
                                <div key={`srv-${imgIdx}`} className="relative w-20 aspect-[4/3] rounded border overflow-hidden bg-gray-50 shrink-0">
                                  <img src={url} className="w-full h-full object-cover" alt="Server Preview" />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoomImage(editingRoomIndex, imgIdx)}
                                    className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold shadow-md"
                                  >×</button>
                                </div>
                              ))}
                              {(roomPreviewsMap[editingRoomIndex] || []).map((url: string, localIdx: number) => (
                                <div key={`loc-${localIdx}`} className="relative w-20 aspect-[4/3] rounded border overflow-hidden bg-gray-50 shrink-0">
                                  <img src={url} className="w-full h-full object-cover" alt="Local Preview" />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRoomImage(editingRoomIndex, (subgroupForm.hostRetreatConfig?.rooms?.[editingRoomIndex]?.images || []).length + localIdx)}
                                    className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold shadow-md"
                                  >×</button>
                                </div>
                              ))}
                            </div>

                            <label className="border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-3 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50 text-[10px]">
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-500">Upload Room Image(s)</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple 
                                onChange={(e) => handleRoomImageChange(e, editingRoomIndex)} 
                                className="hidden" 
                              />
                            </label>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowRoomForm(false);
                                setEditingRoomIndex(null);
                              }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-wider"
                            >
                              Done Editing Room
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(!subgroupForm.hostRetreatConfig?.rooms || subgroupForm.hostRetreatConfig.rooms.length === 0) ? (
                            <p className="text-gray-400 italic text-[11px]">No rooms configured yet. Click "+ Add Room" to start.</p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2">
                              {subgroupForm.hostRetreatConfig.rooms.map((room: any, index: number) => {
                                const catStr = room.category?.[activeLangTab] || room.category?.en || "Standard Room";
                                return (
                                  <div key={room.id || index} className="bg-white border p-3 rounded flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                      <div className="bg-brand-cream border border-brand-gold/15 text-brand-gold-dark font-bold text-xs w-10 h-10 rounded-sm flex items-center justify-center">
                                        R{room.number || "?"}
                                      </div>
                                      <div>
                                        <span className="font-bold text-gray-800 text-xs">{catStr}</span>
                                        <div className="text-[10px] text-gray-400 font-light flex gap-2 mt-0.5">
                                          <span>Phase: {room.phase}</span>
                                          <span>•</span>
                                          <span>AC: {room.ac ? "Yes" : "No"}</span>
                                          <span>•</span>
                                          <span>Images: {(room.images || []).length + (roomFilesMap[index] || []).length}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        type="button"
                                        onClick={() => handleEditRoomClick(index)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded text-[10px] font-bold uppercase"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteRoomClick(index)}
                                        className="bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded text-[10px] font-bold uppercase"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: HIGHLIGHT FEATURES */}
                  {hostRetreatTab === "features" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                        Highlight Section Features ({activeLangTab.toUpperCase()})
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Rooms Feature Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("roomsFeatureTitle")}
                              onChange={(e) => setRetreatConfigVal("roomsFeatureTitle", e.target.value)}
                              placeholder="e.g. 10 Air-Conditioned Rooms"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Rooms Feature Description</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("roomsFeatureDesc")}
                              onChange={(e) => setRetreatConfigVal("roomsFeatureDesc", e.target.value)}
                              placeholder="e.g. Spread across 2 private floors..."
                              className="border p-2.5 rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Yoga Hall Feature Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("hallFeatureTitle")}
                              onChange={(e) => setRetreatConfigVal("hallFeatureTitle", e.target.value)}
                              placeholder="e.g. Rooftop Yoga Shala"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Yoga Hall Feature Description</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("hallFeatureDesc")}
                              onChange={(e) => setRetreatConfigVal("hallFeatureDesc", e.target.value)}
                              placeholder="e.g. Rooftop space with sea views..."
                              className="border p-2.5 rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Meals Feature Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("mealsFeatureTitle")}
                              onChange={(e) => setRetreatConfigVal("mealsFeatureTitle", e.target.value)}
                              placeholder="e.g. Healthy Vegetarian Catering"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Meals Feature Description</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("mealsFeatureDesc")}
                              onChange={(e) => setRetreatConfigVal("mealsFeatureDesc", e.target.value)}
                              placeholder="e.g. Locally sourced vegan & veg meals..."
                              className="border p-2.5 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: MEALS & MENUS */}
                  {hostRetreatTab === "meals" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                        Meals & Sample Menu Options ({activeLangTab.toUpperCase()})
                      </h4>
                      <p className="text-[10px] text-gray-500 font-light">List menu items separated by commas.</p>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Breakfast Items</label>
                          <textarea
                            rows={2}
                            value={getRetreatConfigVal("menuBreakfastItems")}
                            onChange={(e) => setRetreatConfigVal("menuBreakfastItems", e.target.value)}
                            placeholder="e.g. Fresh Fruit Juices, Ayurvedic Porridge, Traditional Idli & Dosa, Herbal Infusions"
                            className="border p-2.5 rounded font-sans"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 border-t pt-3">
                          <label className="font-bold text-gray-600 uppercase">Lunch Items</label>
                          <textarea
                            rows={2}
                            value={getRetreatConfigVal("menuLunchItems")}
                            onChange={(e) => setRetreatConfigVal("menuLunchItems", e.target.value)}
                            placeholder="e.g. Kerala Sadhya on Banana Leaf, Organic Brown Rice, Coconut Curry, Local Seasonal Vegetables"
                            className="border p-2.5 rounded font-sans"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 border-t pt-3">
                          <label className="font-bold text-gray-600 uppercase">Dinner Items</label>
                          <textarea
                            rows={2}
                            value={getRetreatConfigVal("menuDinnerItems")}
                            onChange={(e) => setRetreatConfigVal("menuDinnerItems", e.target.value)}
                            placeholder="e.g. Light Vegetable Soup, Grilled Paneer with Herbs, Chapatis, Steamed Broccoli & Carrots"
                            className="border p-2.5 rounded font-sans"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 border-t pt-3">
                          <label className="font-bold text-gray-600 uppercase">General Diet Info / Footnote</label>
                          <textarea
                            rows={2}
                            value={getRetreatConfigVal("menuFooterItems")}
                            onChange={(e) => setRetreatConfigVal("menuFooterItems", e.target.value)}
                            placeholder="e.g. Gluten-free, Lactose-free, and Vegan options are prepared on request."
                            className="border p-2.5 rounded font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Self-Catering Package Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("noMealsOption")}
                              onChange={(e) => setRetreatConfigVal("noMealsOption", e.target.value)}
                              placeholder="e.g. No Meal Catering (Self Catering)"
                              className="border p-2.5 rounded text-xs bg-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Breakfast-Only Package Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("breakfastOnlyOption")}
                              onChange={(e) => setRetreatConfigVal("breakfastOnlyOption", e.target.value)}
                              placeholder="e.g. Breakfast Package Only"
                              className="border p-2.5 rounded text-xs bg-white"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Full-Day Meals Package Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("fullDayOption")}
                              onChange={(e) => setRetreatConfigVal("fullDayOption", e.target.value)}
                              placeholder="e.g. Full Day Vegetarian Menu"
                              className="border p-2.5 rounded text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: LOGISTICS & EXTRAS */}
                  {hostRetreatTab === "logistics" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                        Logistics, Transport & Shala Access ({activeLangTab.toUpperCase()})
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Trivandrum Airport Transport Info</label>
                          <textarea
                            rows={2}
                            value={getRetreatConfigVal("trivandrumAirport")}
                            onChange={(e) => setRetreatConfigVal("trivandrumAirport", e.target.value)}
                            placeholder="e.g. We coordinate airport pickups from Trivandrum (TRV) Airport directly to the villa."
                            className="border p-2.5 rounded font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Small Car Capacity Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("carSmallLabel")}
                              onChange={(e) => setRetreatConfigVal("carSmallLabel", e.target.value)}
                              placeholder="e.g. Sedan (max 3 guests)"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Large Car Capacity Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("carLargeLabel")}
                              onChange={(e) => setRetreatConfigVal("carLargeLabel", e.target.value)}
                              placeholder="e.g. Innova / SUV (max 5 guests)"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Tempo Capacity Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("tempoLabel")}
                              onChange={(e) => setRetreatConfigVal("tempoLabel", e.target.value)}
                              placeholder="e.g. Tempo Traveller (max 12 guests)"
                              className="border p-2.5 rounded"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Yoga Hall Usage Header</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("yogaHallUsageTitle")}
                              onChange={(e) => setRetreatConfigVal("yogaHallUsageTitle", e.target.value)}
                              placeholder="e.g. Rooftop Yoga Shala Access"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Yoga Hall Sessions Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("yogaHallSessionsLabel")}
                              onChange={(e) => setRetreatConfigVal("yogaHallSessionsLabel", e.target.value)}
                              placeholder="e.g. Exclusive daily use for group yoga sessions"
                              className="border p-2.5 rounded"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 border-t pt-3">
                          <label className="font-bold text-gray-600 uppercase">Yoga Hall Images (Rooftop Sala)</label>
                          <div className="flex flex-col gap-3">
                            {yogaHallImagePreviews.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {yogaHallImagePreviews.map((url, imgIdx) => (
                                  <div key={imgIdx} className="relative w-24 aspect-[2/1] rounded border overflow-hidden shrink-0 bg-gray-50 group">
                                    <img src={url} className="w-full h-full object-cover" alt="Yoga Hall Preview" />
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteYogaHallImage(imgIdx)}
                                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                    >×</button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <label className="border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-3 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50 text-[10px]">
                              <Upload className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-500">Upload Yoga Hall Image(s)</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                multiple
                                onChange={handleYogaHallImageChange} 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: BOOKING POLICIES */}
                  {hostRetreatTab === "policies" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                        Booking Confirmation, Terms & policies ({activeLangTab.toUpperCase()})
                      </h4>
                      
                      <div className="space-y-4 text-xs font-sans">
                        <div className="space-y-2">
                          <span className="font-bold text-gray-700 block uppercase">Booking Confirmation Rules</span>
                          <input
                            type="text"
                            value={getRetreatConfigVal("confirmationRule1")}
                            onChange={(e) => setRetreatConfigVal("confirmationRule1", e.target.value)}
                            placeholder="Rule 1: To confirm a retreat booking, a 30% non-refundable advance is required."
                            className="border p-2 rounded w-full text-xs"
                          />
                          <input
                            type="text"
                            value={getRetreatConfigVal("confirmationRule2")}
                            onChange={(e) => setRetreatConfigVal("confirmationRule2", e.target.value)}
                            placeholder="Rule 2: Balance 70% due 30 days prior to arrival."
                            className="border p-2 rounded w-full text-xs"
                          />
                          <input
                            type="text"
                            value={getRetreatConfigVal("confirmationRule3")}
                            onChange={(e) => setRetreatConfigVal("confirmationRule3", e.target.value)}
                            placeholder="Rule 3: Booking is fully confirmed once written confirmation is issued."
                            className="border p-2 rounded w-full text-xs"
                          />
                        </div>

                        <div className="space-y-2 border-t pt-3">
                          <span className="font-bold text-gray-700 block uppercase">Payment Terms Rules</span>
                          <input
                            type="text"
                            value={getRetreatConfigVal("paymentTermsRule1")}
                            onChange={(e) => setRetreatConfigVal("paymentTermsRule1", e.target.value)}
                            placeholder="Rule 1: 30% advance deposit paid via bank transfer."
                            className="border p-2 rounded w-full text-xs"
                          />
                          <input
                            type="text"
                            value={getRetreatConfigVal("paymentTermsRule2")}
                            onChange={(e) => setRetreatConfigVal("paymentTermsRule2", e.target.value)}
                            placeholder="Rule 2: 70% due 30 days prior to arrival."
                            className="border p-2 rounded w-full text-xs"
                          />
                          <input
                            type="text"
                            value={getRetreatConfigVal("paymentTermsRule3")}
                            onChange={(e) => setRetreatConfigVal("paymentTermsRule3", e.target.value)}
                            placeholder="Rule 3: Payments can be settled via card or wire transfer."
                            className="border p-2 rounded w-full text-xs"
                          />
                        </div>

                        <div className="space-y-2 border-t pt-3">
                          <span className="font-bold text-gray-700 block uppercase">Terms & Conditions</span>
                          <input
                            type="text"
                            value={getRetreatConfigVal("termsRule1")}
                            onChange={(e) => setRetreatConfigVal("termsRule1", e.target.value)}
                            placeholder="Rule 1: Valid for selected periods only."
                            className="border p-2 rounded w-full text-xs"
                          />
                          <input
                            type="text"
                            value={getRetreatConfigVal("termsRule2")}
                            onChange={(e) => setRetreatConfigVal("termsRule2", e.target.value)}
                            placeholder="Rule 2: Room allocations subject to availability."
                            className="border p-2 rounded w-full text-xs"
                          />
                          <input
                            type="text"
                            value={getRetreatConfigVal("termsRule3")}
                            onChange={(e) => setRetreatConfigVal("termsRule3", e.target.value)}
                            placeholder="Rule 3: Check-in: 2:00 PM | Check-out: 11:00 AM."
                            className="border p-2 rounded w-full text-xs"
                          />
                        </div>

                        <div className="space-y-2 border-t pt-3">
                          <span className="font-bold text-gray-700 block uppercase">Amendments & Date Changes</span>
                          <input
                            type="text"
                            value={getRetreatConfigVal("amendmentsRule1")}
                            onChange={(e) => setRetreatConfigVal("amendmentsRule1", e.target.value)}
                            placeholder="Rule 1: Date changes are subject to availability."
                            className="border p-2 rounded w-full text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5 border-t pt-3">
                          <label className="font-bold text-gray-700 uppercase">Force Majeure Description</label>
                          <textarea
                            rows={3}
                            value={getRetreatConfigVal("forceMajeureDesc")}
                            onChange={(e) => setRetreatConfigVal("forceMajeureDesc", e.target.value)}
                            placeholder="Describe rules for natural disasters, lockouts, etc."
                            className="border p-2 rounded font-sans"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Footer Greeting Text</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("footerGreeting")}
                              onChange={(e) => setRetreatConfigVal("footerGreeting", e.target.value)}
                              placeholder="We look forward to welcoming you..."
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Footer Signature Text</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("footerSignature")}
                              onChange={(e) => setRetreatConfigVal("footerSignature", e.target.value)}
                              placeholder="Shahid — Villa Lemon Homestay"
                              className="border p-2.5 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 6: CANCELLATION POLICY */}
                  {hostRetreatTab === "cancellation" && (
                    <div className="space-y-4 bg-gray-50 p-4 rounded border border-gray-100">
                      <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                        Cancellation Policy Rules ({activeLangTab.toUpperCase()})
                      </h4>
                      
                      <div className="space-y-4 font-sans">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Cancellation Policy Section Title</label>
                          <input
                            type="text"
                            value={getRetreatConfigVal("cancellationTitle")}
                            onChange={(e) => setRetreatConfigVal("cancellationTitle", e.target.value)}
                            placeholder="e.g. Cancellation Policy"
                            className="border p-2.5 rounded"
                          />
                        </div>

                        {/* Tier 1: 30+ days */}
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Tier 1 — 30+ Days Before Check-in</p>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Heading / Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("cancel60Days")}
                              onChange={(e) => setRetreatConfigVal("cancel60Days", e.target.value)}
                              placeholder="e.g. Cancellations made 30 days or more before the check-in date"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Description</label>
                            <textarea
                              rows={2}
                              value={getRetreatConfigVal("cancel60DaysDesc")}
                              onChange={(e) => setRetreatConfigVal("cancel60DaysDesc", e.target.value)}
                              placeholder="e.g. Eligible for a full refund of the advance payment."
                              className="border p-2.5 rounded font-sans"
                            />
                          </div>
                        </div>

                        {/* Tier 2: Within 30 days */}
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Tier 2 — Within 30 Days Before Check-in</p>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Heading / Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("cancel30to59")}
                              onChange={(e) => setRetreatConfigVal("cancel30to59", e.target.value)}
                              placeholder="e.g. Cancellations made within 30 days of the check-in date"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Description</label>
                            <textarea
                              rows={2}
                              value={getRetreatConfigVal("cancel30to59Desc")}
                              onChange={(e) => setRetreatConfigVal("cancel30to59Desc", e.target.value)}
                              placeholder="e.g. Non-refundable."
                              className="border p-2.5 rounded font-sans"
                            />
                          </div>
                        </div>

                        {/* Tier 3: Less than 30 days (optional) */}
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">Tier 3 — Less than 30 Days (Optional)</p>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Heading / Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("cancelUnder30")}
                              onChange={(e) => setRetreatConfigVal("cancelUnder30", e.target.value)}
                              placeholder="e.g. Cancellations made within 7 days..."
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Description</label>
                            <textarea
                              rows={2}
                              value={getRetreatConfigVal("cancelUnder30Desc")}
                              onChange={(e) => setRetreatConfigVal("cancelUnder30Desc", e.target.value)}
                              placeholder="e.g. 100% of the total booking value will be charged."
                              className="border p-2.5 rounded font-sans"
                            />
                          </div>
                        </div>

                        {/* No-Show (optional) */}
                        <div className="border-t pt-3 space-y-2">
                          <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">No-Show & Early Departure (Optional)</p>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Heading / Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("noShow")}
                              onChange={(e) => setRetreatConfigVal("noShow", e.target.value)}
                              placeholder="e.g. No-Show & Early Departure"
                              className="border p-2.5 rounded"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Description</label>
                            <textarea
                              rows={2}
                              value={getRetreatConfigVal("noShowDesc")}
                              onChange={(e) => setRetreatConfigVal("noShowDesc", e.target.value)}
                              placeholder="e.g. No refund will be provided for unused nights or early departure."
                              className="border p-2.5 rounded font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 8: EXPERIENCE & FAQS */}
                  {hostRetreatTab === "experience-faqs" && (
                    <div className="space-y-6 bg-gray-50 p-4 rounded border border-gray-100">
                      <div>
                        <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5 mb-4">
                          Section 1: Experience & Track Record ({activeLangTab.toUpperCase()})
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Experience Title / Counter</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("experienceTitle")}
                              onChange={(e) => setRetreatConfigVal("experienceTitle", e.target.value)}
                              placeholder="e.g. 5+ Years"
                              className="border p-2.5 rounded bg-white text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Experience Subtitle / Stats Label</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("experienceStats")}
                              onChange={(e) => setRetreatConfigVal("experienceStats", e.target.value)}
                              placeholder="e.g. Hosting Global Retreats"
                              className="border p-2.5 rounded bg-white text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Experience Description</label>
                            <textarea
                              rows={3}
                              value={getRetreatConfigVal("experienceDesc")}
                              onChange={(e) => setRetreatConfigVal("experienceDesc", e.target.value)}
                              placeholder="Describe your history conducting yoga retreats for international groups..."
                              className="border p-2.5 rounded font-sans text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5 mb-4">
                          Section 2: Curated Excursions & Extras ({activeLangTab.toUpperCase()})
                        </h4>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Addons Title</label>
                            <input
                              type="text"
                              value={getRetreatConfigVal("addonsTitle")}
                              onChange={(e) => setRetreatConfigVal("addonsTitle", e.target.value)}
                              placeholder="e.g. Curated Excursions & Extras"
                              className="border p-2.5 rounded bg-white text-xs"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Addons Intro</label>
                            <textarea
                              rows={2}
                              value={getRetreatConfigVal("addonsIntro")}
                              onChange={(e) => setRetreatConfigVal("addonsIntro", e.target.value)}
                              placeholder="Introduction description..."
                              className="border p-2.5 rounded font-sans text-xs bg-white"
                            />
                          </div>

                          {/* DYNAMIC ADDON LIST */}
                          {Array.from({ length: addonCount }, (_, i) => i + 1).map((num) => (
                            <div key={num} className="border-t pt-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-brand-gold text-[10px] uppercase tracking-widest">Addon #{num}</span>
                                {addonCount > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeAddon(num)}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase flex items-center gap-1 border border-red-300 px-2 py-0.5 rounded"
                                  >
                                    ✕ Remove
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-bold text-gray-600 uppercase text-[10px]">Title</label>
                                  <input
                                    type="text"
                                    value={getRetreatConfigVal(`addon${num}Title`)}
                                    onChange={(e) => setRetreatConfigVal(`addon${num}Title`, e.target.value)}
                                    placeholder={`e.g. Addon ${num} title`}
                                    className="border p-2.5 rounded bg-white text-xs"
                                  />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                  <label className="font-bold text-gray-600 uppercase text-[10px]">Description</label>
                                  <textarea
                                    rows={2}
                                    value={getRetreatConfigVal(`addon${num}Desc`)}
                                    onChange={(e) => setRetreatConfigVal(`addon${num}Desc`, e.target.value)}
                                    placeholder={`Addon ${num} details...`}
                                    className="border p-2.5 rounded font-sans text-xs bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => setAddonCount(c => c + 1)}
                            className="mt-3 w-full py-2 border-2 border-dashed border-brand-gold/40 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/5 text-[11px] font-bold uppercase tracking-wider rounded transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            + Add Another Addon
                          </button>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5 mb-4">
                          Section 3: Frequently Asked Questions ({activeLangTab.toUpperCase()})
                        </h4>
                        <div className="space-y-4">
                          {/* DYNAMIC FAQ LIST */}
                          {Array.from({ length: faqCount }, (_, i) => i + 1).map((num) => (
                            <div key={num} className="p-3 border rounded bg-white space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-brand-gold uppercase text-[10px] tracking-widest">FAQ #{num}</span>
                                {faqCount > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeFaq(num)}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase flex items-center gap-1 border border-red-300 px-2 py-0.5 rounded"
                                  >
                                    ✕ Remove
                                  </button>
                                )}
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="font-semibold text-gray-600 text-xs">Question</label>
                                <input
                                  type="text"
                                  value={getRetreatConfigVal(`faq${num}Question`)}
                                  onChange={(e) => setRetreatConfigVal(`faq${num}Question`, e.target.value)}
                                  placeholder={`Question ${num}`}
                                  className="border p-2 rounded w-full text-xs"
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <label className="font-semibold text-gray-600 text-xs">Answer</label>
                                <textarea
                                  rows={2}
                                  value={getRetreatConfigVal(`faq${num}Answer`)}
                                  onChange={(e) => setRetreatConfigVal(`faq${num}Answer`, e.target.value)}
                                  placeholder={`Answer ${num}`}
                                  className="border p-2 rounded w-full text-xs font-sans"
                                />
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => setFaqCount(c => c + 1)}
                            className="w-full py-2 border-2 border-dashed border-brand-gold/40 text-brand-gold hover:border-brand-gold hover:bg-brand-gold/5 text-[11px] font-bold uppercase tracking-wider rounded transition-all duration-200 flex items-center justify-center gap-1"
                          >
                            + Add Another FAQ
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                /* ----------------------------------------------------
                    REGULAR SUBGROUP LAYOUT (DEFAULT)
                ---------------------------------------------------- */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Type selector */}
                    {subgroupFormType === "accommodation" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Subgroup Type</label>
                        <select
                          value={subgroupForm.type}
                          onChange={(e) => setSubgroupForm({ ...subgroupForm, type: e.target.value })}
                          className="border p-2.5 rounded bg-white"
                        >
                          <option value="villa">Entire Villa</option>
                          <option value="floor">Private Floor</option>
                          <option value="room">Individual Room</option>
                        </select>
                      </div>
                    )}

                    {subgroupFormType === "package" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Subgroup Category Key</label>
                        <select
                          value={subgroupForm.category}
                          onChange={(e) => setSubgroupForm({ ...subgroupForm, category: e.target.value })}
                          className="border p-2.5 rounded bg-white"
                        >
                          <option value="varkalaSightseeing">Varkala Sightseeing</option>
                          <option value="dayTrips">Day Trips</option>
                          <option value="backwaterExperiences">Backwater Experiences</option>
                          <option value="adventureActivities">Adventure Activities</option>
                          <option value="varkalaPackages">Varkala Packages</option>
                        </select>
                      </div>
                    )}

                    {subgroupFormType === "yoga" && (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="font-bold text-gray-600 uppercase">Subgroup Type</label>
                          <select
                            value={subgroupForm.type === "retreats" || subgroupForm.type === "classes" || subgroupForm.type === "private" ? subgroupForm.type : "custom"}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSubgroupForm({
                                ...subgroupForm,
                                type: val === "custom" ? "" : val
                              });
                            }}
                            className="border p-2.5 rounded bg-white"
                          >
                            <option value="retreats">Yoga Retreats</option>
                            <option value="classes">Daily Yoga Classes</option>
                            <option value="private">Private Yoga Sessions</option>
                            <option value="custom">Custom (Specify slug)</option>
                          </select>
                        </div>
                        {!(subgroupForm.type === "retreats" || subgroupForm.type === "classes" || subgroupForm.type === "private") && (
                          <div className="flex flex-col gap-1.5">
                            <label className="font-bold text-gray-600 uppercase">Custom Type Slug</label>
                            <input
                              type="text"
                              value={subgroupForm.type || ""}
                              onChange={(e) => setSubgroupForm({ ...subgroupForm, type: e.target.value })}
                              placeholder="e.g. yoga-tour"
                              className="border p-2.5 rounded bg-white"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Href Target Path</label>
                      <input
                        type="text"
                        value={subgroupForm.href || ""}
                        onChange={(e) => setSubgroupForm({ ...subgroupForm, href: e.target.value })}
                        placeholder="/accommodation/villas"
                        className="border p-2.5 rounded"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">CMS Template Layout</label>
                      <select
                        value={subgroupForm.template || "default"}
                        onChange={(e) => setSubgroupForm({ ...subgroupForm, template: e.target.value })}
                        className="border p-2.5 rounded bg-white w-full"
                      >
                        {subgroupFormType === "accommodation" && (
                          <option value="default">Default Accommodation Catalog</option>
                        )}
                        {subgroupFormType === "package" && (
                          <option value="default">Default Tour Package Layout</option>
                        )}
                        {subgroupFormType === "yoga" && (
                          <>
                            <option value="default">Default Programs Grid</option>
                            <option value="retreats">Yoga Retreat Template (Lists retreat entries)</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  {subgroupFormType === "accommodation" && (
                    <div className="flex items-center gap-2 select-none my-2 pl-1">
                      <input
                        type="checkbox"
                        id="subgroupHideRate"
                        checked={subgroupForm.hideRate || false}
                        onChange={(e) => setSubgroupForm({ ...subgroupForm, hideRate: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                      />
                      <label htmlFor="subgroupHideRate" className="font-bold text-gray-700 uppercase cursor-pointer select-none">
                        Hide Price / Rate from Listing Grid
                      </label>
                    </div>
                  )}

                  {/* TRANSLATED FIELDS */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Localized values ({activeLangTab.toUpperCase()})</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Title</label>
                        <input
                          type="text"
                          value={subgroupForm.title?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const title = { ...subgroupForm.title, [activeLangTab]: e.target.value };
                            setSubgroupForm({ ...subgroupForm, title });
                          }}
                          className="border p-2.5 rounded"
                          required={activeLangTab === "en"}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Explore Link Title</label>
                        <input
                          type="text"
                          value={subgroupForm.explore?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const explore = { ...subgroupForm.explore, [activeLangTab]: e.target.value };
                            setSubgroupForm({ ...subgroupForm, explore });
                          }}
                          placeholder="Explore Entire Villas"
                          className="border p-2.5 rounded"
                          required={activeLangTab === "en"}
                        />
                      </div>
                    </div>

                    {subgroupFormType === "accommodation" && subgroupForm.price && (
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Starting Price Label</label>
                        <input
                          type="text"
                          value={subgroupForm.price?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const price = { ...subgroupForm.price, [activeLangTab]: e.target.value };
                            setSubgroupForm({ ...subgroupForm, price });
                          }}
                          placeholder="From ₹24,500 / night"
                          className="border p-2.5 rounded"
                          required={activeLangTab === "en"}
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Description Text</label>
                      <textarea
                        rows={4}
                        value={subgroupForm.description?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const description = { ...subgroupForm.description, [activeLangTab]: e.target.value };
                          setSubgroupForm({ ...subgroupForm, description });
                        }}
                        className="border p-2.5 rounded font-sans"
                        required={activeLangTab === "en"}
                      />
                    </div>
                  </div>

                  {/* BANNER FEATURES — only for accommodation subgroups */}
                  {subgroupFormType === "accommodation" && (
                    <div className="bg-amber-50 p-4 rounded border border-amber-200 space-y-4">
                      <h4 className="font-bold text-amber-800 uppercase tracking-wider border-b border-amber-200 pb-1.5 text-[11px]">
                        Banner Feature Badges ({activeLangTab.toUpperCase()}) — 4 highlighted icons below the hero image
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {([1, 2, 3, 4] as const).map((n) => (
                          <div key={n} className="bg-white border border-amber-100 rounded p-3 space-y-2">
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Feature {n}</span>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Title</label>
                              <input
                                type="text"
                                value={(subgroupForm as any)[`feature${n}Title`]?.[activeLangTab] || ""}
                                onChange={(e) => {
                                  const key = `feature${n}Title`;
                                  const prev = (subgroupForm as any)[key] || { en: "", de: "", fr: "", ru: "" };
                                  setSubgroupForm({ ...subgroupForm, [key]: { ...prev, [activeLangTab]: e.target.value } });
                                }}
                                placeholder={n === 1 ? "Private Pool" : n === 2 ? "Spacious Living" : n === 3 ? "Premium Amenities" : "Dedicated Service"}
                                className="border p-2 rounded text-xs"
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="font-bold text-gray-500 uppercase text-[10px]">Subtitle</label>
                              <input
                                type="text"
                                value={(subgroupForm as any)[`feature${n}Subtitle`]?.[activeLangTab] || ""}
                                onChange={(e) => {
                                  const key = `feature${n}Subtitle`;
                                  const prev = (subgroupForm as any)[key] || { en: "", de: "", fr: "", ru: "" };
                                  setSubgroupForm({ ...subgroupForm, [key]: { ...prev, [activeLangTab]: e.target.value } });
                                }}
                                placeholder={n === 1 ? "In most villas" : n === 2 ? "For families & groups" : n === 3 ? "Luxury redefined" : "24/7 assistance"}
                                className="border p-2 rounded text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cover Image Upload */}
                  <div className="space-y-2">
                    <label className="font-bold text-gray-600 uppercase">Cover Banner Image(s) (Upload multiple for slideshow)</label>
                    <div className="flex flex-col gap-3">
                      {coverImagePreviews && coverImagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {coverImagePreviews.map((url, idx) => (
                            <div key={idx} className="relative w-24 aspect-[2/1] rounded border overflow-hidden shrink-0 bg-gray-50 group">
                              <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleDeleteCoverImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                title="Remove image"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-500">Upload Banner Image(s)</span>
                        <input type="file" accept="image/*" multiple onChange={handleCoverImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>
                </>
              )}

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubgroupModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingSubgroup} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingSubgroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Category</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ACCOMMODATION / STAY DETAILS FORM
      ======================================================== */}
      {showStayModal && stayForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-none sm:rounded-md max-w-4xl w-full h-screen sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl border-0 sm:border border-gray-150">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingStay ? "Edit Accommodation Stay" : "Create Accommodation Stay"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure layout, assets, and details checklist</p>
              </div>
              <button onClick={() => setShowStayModal(false)} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Selection Tabs */}
            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            {/* Scroll Form Content */}
            <form onSubmit={handleSaveStay} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              {/* SECTION: GENERAL SPECS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">1. General Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Property Category</label>
                    <select
                      value={stayForm.accommodationType}
                      onChange={(e) => setStayForm({ ...stayForm, accommodationType: e.target.value as any })}
                      className="border border-gray-200 p-2.5 rounded bg-white"
                    >
                      <option value="villa">Entire Villa</option>
                      <option value="floor">Private Floor</option>
                      <option value="room">Individual Room</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Slug Identifier (Unique URL)</label>
                    <input
                      type="text"
                      value={stayForm.slug}
                      onChange={(e) => setStayForm({ ...stayForm, slug: e.target.value })}
                      placeholder="e.g. lemon-grove-villa"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Starting Price per Period (₹)</label>
                    <input
                      type="number"
                      value={stayForm.price}
                      onChange={(e) => setStayForm({ ...stayForm, price: Number(e.target.value) })}
                      placeholder="e.g. 24500"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Bedrooms</label>
                    <input
                      type="number"
                      value={stayForm.bedrooms}
                      onChange={(e) => setStayForm({ ...stayForm, bedrooms: Number(e.target.value) })}
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Bathrooms</label>
                    <input
                      type="number"
                      value={stayForm.bathrooms}
                      onChange={(e) => setStayForm({ ...stayForm, bathrooms: Number(e.target.value) })}
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Max Guests</label>
                    <input
                      type="number"
                      value={stayForm.guests}
                      onChange={(e) => setStayForm({ ...stayForm, guests: Number(e.target.value) })}
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Check-In Time</label>
                    <input
                      type="text"
                      value={stayForm.checkInTime}
                      onChange={(e) => setStayForm({ ...stayForm, checkInTime: e.target.value })}
                      placeholder="14:00"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Check-Out Time</label>
                    <input
                      type="text"
                      value={stayForm.checkOutTime}
                      onChange={(e) => setStayForm({ ...stayForm, checkOutTime: e.target.value })}
                      placeholder="11:00"
                      className="border border-gray-200 p-2.5 rounded"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 mt-4">
                  <label className="font-bold text-gray-600 uppercase">Google Maps Embed Link (Src URL)</label>
                  <input
                    type="text"
                    value={stayForm.mapLink || ""}
                    onChange={(e) => setStayForm({ ...stayForm, mapLink: e.target.value })}
                    placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                    className="border border-gray-200 p-2.5 rounded w-full"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 select-none">
                  <input
                    type="checkbox"
                    id="hideRate"
                    checked={stayForm.hideRate || false}
                    onChange={(e) => setStayForm({ ...stayForm, hideRate: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                  />
                  <label htmlFor="hideRate" className="font-bold text-gray-700 uppercase cursor-pointer">
                    Hide Price / Rate from Listing Grid
                  </label>
                </div>
              </div>

              {/* SECTION: TRANSLATED CORE FIELDS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">
                  2. Localized Text Fields ({activeLangTab.toUpperCase()})
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Property Title</label>
                    <input
                      type="text"
                      value={stayForm.title?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const title = { ...stayForm.title, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, title });
                      }}
                      placeholder="Lemon Grove Villa"
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Price Period Label</label>
                    <input
                      type="text"
                      value={stayForm.pricePeriod?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const pricePeriod = { ...stayForm.pricePeriod, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, pricePeriod });
                      }}
                      placeholder="/ night"
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Location Descriptor</label>
                    <input
                      type="text"
                      value={stayForm.location?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const location = { ...stayForm.location, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, location });
                      }}
                      placeholder="Varkala, Kerala"
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Tagline (Detail Page Top)</label>
                    <input
                      type="text"
                      value={stayForm.tagline?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const tagline = { ...stayForm.tagline, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, tagline });
                      }}
                      placeholder="Unrivaled ocean breezes surrounding private pool sanctuary..."
                      className="border border-gray-200 p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Grid Badge Text (Optional)</label>
                    <input
                      type="text"
                      value={stayForm.badgeText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const badgeText = { ...stayForm.badgeText, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, badgeText });
                      }}
                      placeholder="e.g. Featured, Gold, Guided (empty to hide)"
                      className="border border-gray-200 p-2.5 rounded"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Short Card Description</label>
                  <textarea
                    rows={2}
                    value={stayForm.shortDescription?.[activeLangTab] || ""}
                    onChange={(e) => {
                      const shortDescription = { ...stayForm.shortDescription, [activeLangTab]: e.target.value } as any;
                      setStayForm({ ...stayForm, shortDescription });
                    }}
                    placeholder="Short description displayed on card catalog grids."
                    className="border border-gray-200 p-2.5 rounded font-sans"
                    required={activeLangTab === "en"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Overview About Text (Para 1)</label>
                    <textarea
                      rows={4}
                      value={stayForm.aboutText1?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const aboutText1 = { ...stayForm.aboutText1, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, aboutText1 });
                      }}
                      placeholder="Main about paragraph..."
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Overview About Text (Para 2)</label>
                    <textarea
                      rows={4}
                      value={stayForm.aboutText2?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const aboutText2 = { ...stayForm.aboutText2, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, aboutText2 });
                      }}
                      placeholder="Secondary about paragraph..."
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Perfect Location Details</label>
                    <textarea
                      rows={2}
                      value={stayForm.perfectLocationText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const perfectLocationText = { ...stayForm.perfectLocationText, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, perfectLocationText });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Group Capacity Info</label>
                    <textarea
                      rows={2}
                      value={stayForm.groupAccommodationText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const groupAccommodationText = { ...stayForm.groupAccommodationText, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, groupAccommodationText });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="font-bold text-gray-600 uppercase">Important Notes ({activeLangTab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      value={stayForm.notes?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const notes = { ...stayForm.notes, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, notes });
                      }}
                      placeholder="e.g. Reservation rules, warning about pets, cancellation policy summary..."
                      className="border border-gray-200 p-2.5 rounded font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: TWO IMAGES ASSETS UPLOADS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">3. Cover Photo & About Photo Assets</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Cover Photo */}
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="font-bold text-gray-600 uppercase">Main Cover Image Banner(s) (Upload multiple for slideshow)</label>
                    <div className="flex flex-col gap-3">
                      {coverImagePreviews && coverImagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {coverImagePreviews.map((url, idx) => (
                            <div key={idx} className="relative w-24 aspect-[4/3] rounded border bg-gray-100 overflow-hidden shrink-0 group">
                              <img src={url} className="w-full h-full object-cover" alt={`Cover Preview ${idx + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleDeleteCoverImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                title="Remove image"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-500">Upload Cover Image(s)</span>
                        <input type="file" accept="image/*" multiple onChange={handleCoverImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* About Photo(s) */}
                  <div className="space-y-2 col-span-1 sm:col-span-2">
                    <label className="font-bold text-gray-600 uppercase">About Section Image(s) (Hammock Photos - Multiple for Slideshow)</label>
                    <div className="flex flex-col gap-3">
                      {aboutImagePreviews && aboutImagePreviews.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {aboutImagePreviews.map((url, idx) => (
                            <div key={idx} className="relative w-24 aspect-[4/3] rounded border bg-gray-100 overflow-hidden shrink-0 group">
                              <img src={url} className="w-full h-full object-cover" alt={`About Preview ${idx + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleDeleteAboutImage(idx)}
                                className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                title="Remove image"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="font-semibold text-gray-500">Upload About Image(s)</span>
                        <input type="file" accept="image/*" multiple onChange={handleAboutImageChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Gallery Photos */}
                  <div className="space-y-3 sm:col-span-2 pt-4 border-t">
                    <label className="font-bold text-gray-600 uppercase block">Rooms & Villa Gallery Photos</label>
                    
                    {/* Existing Gallery Images with delete buttons */}
                    {stayForm.gallery && stayForm.gallery.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3 bg-white p-3 rounded border shadow-inner">
                        {stayForm.gallery.map((url: string, idx: number) => (
                          <div key={idx} className="relative aspect-[4/3] rounded border overflow-hidden group bg-gray-100">
                            <img src={url} className="w-full h-full object-cover animate-fade-in" alt={`Gallery ${idx}`} />
                            <button
                              type="button"
                              onClick={() => {
                                const gallery = (stayForm.gallery || []).filter((_, i) => i !== idx);
                                setStayForm({ ...stayForm, gallery });
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 opacity-90 transition-opacity shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Upload File Zone */}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-6 text-center cursor-pointer bg-white hover:bg-gray-50">
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="font-semibold text-gray-500">Select Rooms & Villa Photos (Multiple allowed)</span>
                          <span className="text-[10px] text-gray-400">Add up to 10 images</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setNewGalleryFiles((prev) => [...prev, ...files]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Preview of newly selected files to upload */}
                      {newGalleryFiles.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded p-3 text-left">
                          <span className="font-bold text-amber-800 text-[10px] uppercase block tracking-wider mb-2">New uploads (Pending save)</span>
                          <div className="flex flex-wrap gap-2">
                            {newGalleryFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-white border border-amber-200 px-2.5 py-1.5 rounded text-xs text-amber-900 shadow-sm">
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-500 hover:text-red-700 font-bold"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: STRUCTURAL ARRAY LISTS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">4. Amenities & Services sub-lists</h4>
                
                {/* Room Amenities list editor */}
                <div className="space-y-2 text-left">
                  <label className="font-bold text-gray-600 uppercase block">Room Amenities Checklist ({activeLangTab.toUpperCase()})</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(stayForm.roomAmenities || []).map((am, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded">
                        <span>{am[activeLangTab] || ""}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const roomAmenities = [...(stayForm.roomAmenities || [])];
                            roomAmenities.splice(idx, 1);
                            setStayForm({ ...stayForm, roomAmenities });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      id="newAmenityInput"
                      placeholder="e.g. Free Wi-Fi"
                      className="border p-2 rounded flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (!input.value.trim()) return;
                          const roomAmenities = [...(stayForm.roomAmenities || [])];
                          roomAmenities.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, roomAmenities });
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newAmenityInput") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const roomAmenities = [...(stayForm.roomAmenities || [])];
                          roomAmenities.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, roomAmenities });
                          input.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Ideal For list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Ideal For Matches Checklist ({activeLangTab.toUpperCase()})</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(stayForm.idealFor || []).map((ideal, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded">
                        <span>{ideal[activeLangTab] || ""}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const idealFor = [...(stayForm.idealFor || [])];
                            idealFor.splice(idx, 1);
                            setStayForm({ ...stayForm, idealFor });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      id="newIdealForInput"
                      placeholder="e.g. Yoga Retreats"
                      className="border p-2 rounded flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (!input.value.trim()) return;
                          const idealFor = [...(stayForm.idealFor || [])];
                          idealFor.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, idealFor });
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newIdealForInput") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const idealFor = [...(stayForm.idealFor || [])];
                          idealFor.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, idealFor });
                          input.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Why Guests Love Us list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Why Guests Love Us List ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    {(stayForm.whyGuestsLoveUs || []).map((w, idx) => (
                      <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                        <div>
                          <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] block">icon: {w.icon}</span>
                          <h5 className="font-serif font-bold text-xs text-[#121212] mt-0.5">{w.title[activeLangTab]}</h5>
                          <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed font-sans">{w.desc[activeLangTab]}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const whyGuestsLoveUs = [...(stayForm.whyGuestsLoveUs || [])];
                            whyGuestsLoveUs.splice(idx, 1);
                            setStayForm({ ...stayForm, whyGuestsLoveUs });
                          }}
                          className="text-red-500 shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-100/50 border rounded p-4 space-y-3">
                    <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New "Why Guests Love Us" item</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Icon key</label>
                        <select id="newLoveIcon" className="border p-2 rounded bg-white text-xs">
                          <option value="star">Star</option>
                          <option value="coffee">Coffee (Breakfast)</option>
                          <option value="sunset">Sunset</option>
                          <option value="balcony">Balcony</option>
                          <option value="chat">Chat / Hosts</option>
                          <option value="pool">Pool</option>
                          <option value="wifi">WiFi</option>
                          <option value="shield">Shield / Safe</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 sm:col-span-2">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Title</label>
                        <input type="text" id="newLoveTitle" placeholder="e.g. Organic Breakfast" className="border p-2 rounded text-xs" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-bold text-gray-500 text-[9px] uppercase">Description</label>
                      <textarea id="newLoveDesc" rows={2} placeholder="e.g. Freshly prepared local delicacies served on your balcony." className="border p-2 rounded text-xs font-sans" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const iconSelect = document.getElementById("newLoveIcon") as HTMLSelectElement;
                        const titleIn = document.getElementById("newLoveTitle") as HTMLInputElement;
                        const descIn = document.getElementById("newLoveDesc") as HTMLTextAreaElement;
                        if (iconSelect && titleIn && descIn && titleIn.value.trim() && descIn.value.trim()) {
                          const whyGuestsLoveUs = [...(stayForm.whyGuestsLoveUs || [])];
                          whyGuestsLoveUs.push({
                            icon: iconSelect.value,
                            title: createEmptyLocalizedText(titleIn.value.trim()),
                            desc: createEmptyLocalizedText(descIn.value.trim())
                          });
                          setStayForm({ ...stayForm, whyGuestsLoveUs });
                          titleIn.value = "";
                          descIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Distances Editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Landmarks Distances table ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(stayForm.distances || []).map((d, idx) => (
                      <div key={idx} className="flex items-center justify-between border bg-white p-2 rounded gap-2">
                        <span className="font-medium truncate">{d.place[activeLangTab]} - {d.distance[activeLangTab]}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const distances = [...(stayForm.distances || [])];
                            distances.splice(idx, 1);
                            setStayForm({ ...stayForm, distances });
                          }}
                          className="text-red-500 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-md pt-1">
                    <input type="text" id="newPlaceInput" placeholder="Landmark Place e.g. Black Beach" className="border p-2 rounded w-1/2" />
                    <input type="text" id="newDistanceInput" placeholder="Distance e.g. 900 m" className="border p-2 rounded w-1/3" />
                    <button
                      type="button"
                      onClick={() => {
                        const placeIn = document.getElementById("newPlaceInput") as HTMLInputElement;
                        const distIn = document.getElementById("newDistanceInput") as HTMLInputElement;
                        if (placeIn && distIn && placeIn.value.trim() && distIn.value.trim()) {
                          const distances = [...(stayForm.distances || [])];
                          distances.push({
                            place: createEmptyLocalizedText(placeIn.value.trim()),
                            distance: createEmptyLocalizedText(distIn.value.trim())
                          });
                          setStayForm({ ...stayForm, distances });
                          placeIn.value = "";
                          distIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3 py-2 rounded font-bold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Highlights list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Property Highlights (Key Features) ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    {(stayForm.highlights || []).map((h, idx) => (
                      <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">Icon: {h.icon}</span>
                          <span className="font-medium text-xs text-[#121212]">{h.label[activeLangTab]}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const highlights = [...(stayForm.highlights || [])];
                            highlights.splice(idx, 1);
                            setStayForm({ ...stayForm, highlights });
                          }}
                          className="text-red-500 hover:text-red-700 shrink-0"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-md pt-1">
                    <select id="newHighlightIcon" className="border p-2 rounded bg-white text-xs w-1/3">
                      <option value="wifi">WiFi</option>
                      <option value="pool">Pool</option>
                      <option value="coffee">Coffee / Breakfast</option>
                      <option value="shield">Security</option>
                      <option value="sunset">Sunset View</option>
                      <option value="balcony">Balcony</option>
                      <option value="wind">AC / Breeze</option>
                      <option value="tv">TV</option>
                      <option value="key">Key Access</option>
                      <option value="compass">Compass / Guide</option>
                    </select>
                    <input
                      type="text"
                      id="newHighlightLabel"
                      placeholder="Highlight label e.g. Free Wi-Fi"
                      className="border p-2 rounded w-1/2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const iconSelect = document.getElementById("newHighlightIcon") as HTMLSelectElement;
                        const labelIn = document.getElementById("newHighlightLabel") as HTMLInputElement;
                        if (iconSelect && labelIn && labelIn.value.trim()) {
                          const highlights = [...(stayForm.highlights || [])];
                          highlights.push({
                            icon: iconSelect.value,
                            label: createEmptyLocalizedText(labelIn.value.trim())
                          });
                          setStayForm({ ...stayForm, highlights });
                          labelIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-bold uppercase tracking-wider text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Check In Out Rules list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Check-In / Check-Out Rules Checklist ({activeLangTab.toUpperCase()})</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(stayForm.checkInOutRules || []).map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 bg-white border px-2.5 py-1.5 rounded">
                        <span>{rule[activeLangTab] || ""}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const checkInOutRules = [...(stayForm.checkInOutRules || [])];
                            checkInOutRules.splice(idx, 1);
                            setStayForm({ ...stayForm, checkInOutRules });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 max-w-sm">
                    <input
                      type="text"
                      id="newRuleInput"
                      placeholder="e.g. Quiet hours after 10 PM"
                      className="border p-2 rounded flex-grow"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const input = e.currentTarget;
                          if (!input.value.trim()) return;
                          const checkInOutRules = [...(stayForm.checkInOutRules || [])];
                          checkInOutRules.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, checkInOutRules });
                          input.value = "";
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("newRuleInput") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          const checkInOutRules = [...(stayForm.checkInOutRules || [])];
                          checkInOutRules.push(createEmptyLocalizedText(input.value.trim()));
                          setStayForm({ ...stayForm, checkInOutRules });
                          input.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Additional Services list editor */}
                <div className="space-y-2 text-left pt-4 border-t">
                  <label className="font-bold text-gray-600 uppercase block">Additional Services List ({activeLangTab.toUpperCase()})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    {(stayForm.additionalServices || []).map((s, idx) => (
                      <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                        <div>
                          <h5 className="font-serif font-bold text-xs text-[#121212]">{s.service[activeLangTab]}</h5>
                          <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed font-sans">{s.details[activeLangTab]}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const additionalServices = [...(stayForm.additionalServices || [])];
                            additionalServices.splice(idx, 1);
                            setStayForm({ ...stayForm, additionalServices });
                          }}
                          className="text-red-500 shrink-0 mt-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-100/50 border rounded p-4 space-y-3">
                    <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New Additional Service</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Service Name</label>
                        <input type="text" id="newServiceName" placeholder="e.g. Airport Transfer" className="border p-2 rounded text-xs" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Service Details</label>
                        <input type="text" id="newServiceDetails" placeholder="e.g. Price on request, luxury sedan transfer." className="border p-2 rounded text-xs" />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const nameIn = document.getElementById("newServiceName") as HTMLInputElement;
                        const detailsIn = document.getElementById("newServiceDetails") as HTMLInputElement;
                        if (nameIn && detailsIn && nameIn.value.trim() && detailsIn.value.trim()) {
                          const additionalServices = [...(stayForm.additionalServices || [])];
                          additionalServices.push({
                            service: createEmptyLocalizedText(nameIn.value.trim()),
                            details: createEmptyLocalizedText(detailsIn.value.trim())
                          });
                          setStayForm({ ...stayForm, additionalServices });
                          nameIn.value = "";
                          detailsIn.value = "";
                        }
                      }}
                      className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                    >
                      Add Service
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION: RELATED STAYS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">You May Also Like (Related Stays)</h4>
                <p className="text-[10px] text-gray-500">Select up to 3 stays to recommend at the bottom of this stay's details page.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => {
                    const currentSelected = stayForm.relatedAccommodations?.[index] || "";
                    return (
                      <div key={index} className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Recommendation #{index + 1}</label>
                        <select
                          value={currentSelected}
                          onChange={(e) => {
                            const newRelated = [...(stayForm.relatedAccommodations || [])];
                            while (newRelated.length < 3) {
                              newRelated.push("");
                            }
                            newRelated[index] = e.target.value;
                            setStayForm({ ...stayForm, relatedAccommodations: newRelated });
                          }}
                        >
                          <option value="">-- None --</option>
                          <optgroup label="Stays / Accommodations">
                            {stays
                              .filter((s) => s.slug !== stayForm.slug)
                              .map((s) => (
                                <option key={s._id} value={s.slug}>
                                  🏨 {s.title[activeLangTab] || s.title["en"] || s.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Tours / Packages">
                            {packages
                              .filter((p) => p.slug !== stayForm.slug)
                              .map((p) => (
                                <option key={p._id} value={p.slug}>
                                  🎒 {p.title[activeLangTab] || p.title["en"] || p.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Yoga Programs & Retreats">
                            {yogas
                              .filter((y) => y.slug !== stayForm.slug)
                              .map((y) => (
                                <option key={y._id} value={y.slug}>
                                  🧘 [Class] {y.title[activeLangTab] || y.title["en"] || y.slug}
                                </option>
                              ))}
                            {retreats
                              .filter((r) => r.slug !== stayForm.slug)
                              .map((r) => (
                                <option key={r._id} value={r.slug}>
                                  🧘 [Retreat] {r.heroTitle?.[activeLangTab] || r.heroTitle?.["en"] || r.slug}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: SEO METADATA */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">5. SEO & Social Metadata ({activeLangTab.toUpperCase()})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Meta Title Tag</label>
                    <input
                      type="text"
                      value={stayForm.metaTitle?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const metaTitle = { ...stayForm.metaTitle, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, metaTitle });
                      }}
                      className="border border-gray-200 p-2.5 rounded text-xs bg-white"
                      placeholder="e.g. Luxury 3 Bedroom Beach Villa in Varkala | Villa Lemon"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Canonical URL link</label>
                    <input
                      type="text"
                      value={stayForm.canonicalUrl || ""}
                      onChange={(e) => setStayForm({ ...stayForm, canonicalUrl: e.target.value })}
                      className="border border-gray-200 p-2.5 rounded text-xs bg-white"
                      placeholder="e.g. https://villalemon.com/accommodation/villas/lemon-grove-villa"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Meta Description tag</label>
                    <textarea
                      rows={3}
                      value={stayForm.metaDescription?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const metaDescription = { ...stayForm.metaDescription, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, metaDescription });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans text-xs bg-white"
                      placeholder="Describe the villa details for search engines..."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">SEO Keywords tag</label>
                    <textarea
                      rows={3}
                      value={stayForm.keywords?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const keywords = { ...stayForm.keywords, [activeLangTab]: e.target.value } as any;
                        setStayForm({ ...stayForm, keywords });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans text-xs bg-white"
                      placeholder="e.g. luxury villa, private pool varkala, beach rental"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="font-bold text-gray-600 uppercase">Social Sharing Image (OG Image)</label>
                    <div className="flex items-center gap-3">
                      {ogImagePreview && (
                        <div className="w-24 h-16 rounded border overflow-hidden shrink-0 bg-gray-150 relative group">
                          <img src={ogImagePreview} className="w-full h-full object-cover" alt="OG Preview" />
                          <button
                            type="button"
                            onClick={() => {
                              setOgImagePreview(null);
                              setOgImageFile(null);
                            }}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      <label className="flex-grow border border-dashed border-gray-300 hover:border-brand-gold rounded p-4 cursor-pointer text-center bg-white hover:bg-amber-50/20 transition-all select-none">
                        <div className="flex flex-col items-center justify-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          <Upload className="w-4 h-4 text-gray-400 mb-1" />
                          <span>Upload Custom OG Image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setOgImageFile(file);
                              setOgImagePreview(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowStayModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingStay}
                  className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {savingStay ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Stay...</span>
                    </>
                  ) : (
                    <span>Save Stay</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TOUR PACKAGE FORM
      ======================================================== */}
      {showPackageModal && packageForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingPackage ? "Edit Tour Package" : "Create Tour Package"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure itinerary, inclusions, and covers</p>
              </div>
              <button onClick={() => setShowPackageModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <div className="px-6 py-2 border-b border-gray-100 bg-gray-50 flex gap-2 flex-wrap text-[10px] font-bold uppercase tracking-wider">
              {[
                { id: "general", label: "General Info" },
                { id: "localized", label: "Content" },
                { id: "media", label: "Media" },
                { id: "highlights", label: "Highlights & Facts" },
                { id: "checklists", label: "Checklists" },
                { id: "itinerary", label: "Itinerary" },
                { id: "related", label: "Related & FAQs" },
                { id: "seo", label: "SEO" },
                { id: "booking", label: "Booking Details" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActivePkgFormTab(tab.id)}
                  className={`px-3 py-1.5 rounded-sm transition-all duration-200 ${
                    activePkgFormTab === tab.id ? "bg-[#121212] text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSavePackage} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              {activePkgFormTab === "general" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Package Categories (Select one or more)</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-1">
                        {[
                          { value: "varkalaSightseeing", label: "Varkala Sightseeing" },
                          { value: "dayTrips", label: "Day Trips" },
                          { value: "backwaterExperiences", label: "Backwater Experiences" },
                          { value: "adventureActivities", label: "Adventure Activities" },
                          { value: "varkalaPackages", label: "Varkala Packages" },
                        ].map((cat) => {
                          const isChecked = Array.isArray(packageForm.packageCategory)
                            ? packageForm.packageCategory.includes(cat.value as any)
                            : packageForm.packageCategory === cat.value;
                          return (
                            <label
                              key={cat.value}
                              className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors duration-200 select-none text-[11px] ${
                                isChecked
                                  ? "border-brand-gold bg-brand-cream-soft text-[#121212] font-semibold"
                                  : "border-gray-250 bg-white hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                  let currentCats = Array.isArray(packageForm.packageCategory)
                                    ? [...packageForm.packageCategory]
                                    : packageForm.packageCategory
                                    ? [packageForm.packageCategory]
                                    : [];
                                  if (e.target.checked) {
                                    if (!currentCats.includes(cat.value as any)) {
                                      currentCats.push(cat.value as any);
                                    }
                                  } else {
                                    currentCats = currentCats.filter((val) => val !== cat.value);
                                  }
                                  // Always ensure at least one is selected
                                  if (currentCats.length === 0) {
                                    currentCats = ["varkalaSightseeing" as any];
                                  }
                                  setPackageForm({ ...packageForm, packageCategory: currentCats });
                                }}
                                className="w-3.5 h-3.5 accent-brand-gold cursor-pointer"
                              />
                              <span>{cat.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Unique Slug URL</label>
                        <input
                          type="text"
                          value={packageForm.slug}
                          onChange={(e) => setPackageForm({ ...packageForm, slug: e.target.value })}
                          className="border p-2.5 rounded text-xs bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Starting Price (₹)</label>
                        <input
                          type="number"
                          value={packageForm.price}
                          onChange={(e) => setPackageForm({ ...packageForm, price: Number(e.target.value) })}
                          className="border p-2.5 rounded text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 select-none">
                     <input
                       type="checkbox"
                       id="pkgHideRate"
                       checked={packageForm.hideRate || false}
                       onChange={(e) => setPackageForm({ ...packageForm, hideRate: e.target.checked })}
                       className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                     />
                     <label htmlFor="pkgHideRate" className="font-bold text-gray-700 uppercase cursor-pointer">
                       Hide Price / Rate from Listing Grid
                     </label>
                   </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Duration ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.duration?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const duration = { ...packageForm.duration, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, duration });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. 4 Hours"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Travel Time ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.travelTime?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const travelTime = { ...packageForm.travelTime, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, travelTime });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. 1 Hour each way"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Entry Fee ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.entryFee?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const entryFee = { ...packageForm.entryFee, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, entryFee });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Included / ₹100 per person"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Optional Charges ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.optionalCharges?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const optionalCharges = { ...packageForm.optionalCharges, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, optionalCharges });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Camera charges ₹50"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Difficulty ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.difficulty?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const difficulty = { ...packageForm.difficulty, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, difficulty });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Easy / Moderate"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Group Size ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.groupSize?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const groupSize = { ...packageForm.groupSize, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, groupSize });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Max 10 people"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="font-bold text-gray-600 uppercase">Location ({activeLangTab.toUpperCase()})</label>
                      <input
                        type="text"
                        value={packageForm.location?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const location = { ...packageForm.location, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, location });
                        }}
                        className="border p-2.5 rounded text-xs"
                        placeholder="e.g. Munroe Island, Kollam"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "localized" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Localized Content ({activeLangTab.toUpperCase()})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Package Title</label>
                        <input
                          type="text"
                          value={packageForm.title?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const title = { ...packageForm.title, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, title });
                          }}
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Price Period Label</label>
                        <input
                          type="text"
                          value={packageForm.pricePeriod?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const pricePeriod = { ...packageForm.pricePeriod, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, pricePeriod });
                          }}
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Tagline</label>
                        <input
                          type="text"
                          value={packageForm.tagline?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const tagline = { ...packageForm.tagline, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, tagline });
                          }}
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Grid Badge Text (Optional)</label>
                        <input
                          type="text"
                          value={packageForm.badgeText?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const badgeText = { ...packageForm.badgeText, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, badgeText });
                          }}
                          placeholder="e.g. Popular, Premium, Star (empty to hide)"
                          className="border p-2.5 rounded text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Short Description</label>
                        <textarea
                          rows={3}
                          value={packageForm.shortDescription?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const shortDescription = { ...packageForm.shortDescription, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, shortDescription });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">About (Full Description)</label>
                        <textarea
                          rows={3}
                          value={packageForm.aboutText?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const aboutText = { ...packageForm.aboutText, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, aboutText });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">Tour Overview</label>
                        <textarea
                          rows={3}
                          value={packageForm.tourOverview?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const tourOverview = { ...packageForm.tourOverview, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, tourOverview });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Best Time to Visit</label>
                        <input
                          type="text"
                          value={packageForm.bestTime?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const bestTime = { ...packageForm.bestTime, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, bestTime });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Evening sunset / Nov-Feb"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Dress Code</label>
                        <input
                          type="text"
                          value={packageForm.dressCode?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const dressCode = { ...packageForm.dressCode, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, dressCode });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Modest wear / Beachwear"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">CTA Button Text</label>
                        <input
                          type="text"
                          value={packageForm.cta?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const cta = { ...packageForm.cta, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, cta });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Book Sightseeing / Enquire"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "media" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                      <label className="font-bold text-gray-600 uppercase">Cover Banner Image(s) (Upload multiple for slideshow)</label>
                      <div className="flex flex-col gap-3">
                        {coverImagePreviews && coverImagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {coverImagePreviews.map((url, idx) => (
                              <div key={idx} className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0 group">
                                <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCoverImage(idx)}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                  title="Remove image"
                                >×</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-500">Upload Cover Image(s)</span>
                          <input type="file" accept="image/*" multiple onChange={handleCoverImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2 col-span-1 sm:col-span-2">
                      <label className="font-bold text-gray-600 uppercase">Details Section Image(s) (Multiple for Slideshow)</label>
                      <div className="flex flex-col gap-3">
                        {aboutImagePreviews && aboutImagePreviews.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {aboutImagePreviews.map((url, idx) => (
                              <div key={idx} className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0 group">
                                <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAboutImage(idx)}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                                  title="Remove image"
                                >×</button>
                              </div>
                            ))}
                          </div>
                        )}
                        <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-500">Upload Detail Image(s)</span>
                          <input type="file" accept="image/*" multiple onChange={handleAboutImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">YouTube / Video Embed Link</label>
                    <input
                      type="text"
                      value={packageForm.video || ""}
                      onChange={(e) => setPackageForm({ ...packageForm, video: e.target.value })}
                      className="border p-2.5 rounded text-xs bg-white"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Tour Gallery Photos</label>
                    
                    {/* Existing Gallery Images with delete buttons */}
                    {packageForm.gallery && packageForm.gallery.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-3 bg-white p-3 rounded border shadow-inner">
                        {packageForm.gallery.map((url: string, idx: number) => (
                          <div key={idx} className="relative aspect-[4/3] rounded border overflow-hidden group bg-gray-100">
                            <img src={url} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                            <button
                              type="button"
                              onClick={() => {
                                const gallery = (packageForm.gallery || []).filter((_, i) => i !== idx);
                                setPackageForm({ ...packageForm, gallery });
                              }}
                              className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full p-1 opacity-90 transition-opacity shadow"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Upload File Zone */}
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-6 text-center cursor-pointer bg-white hover:bg-gray-50">
                        <div className="flex flex-col items-center gap-1">
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="font-semibold text-gray-500">Select Gallery Photos (Multiple allowed)</span>
                          <span className="text-[10px] text-gray-400">Add up to 10 images</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setNewGalleryFiles((prev) => [...prev, ...files]);
                            }
                          }}
                          className="hidden"
                        />
                      </label>

                      {/* Preview of newly selected files to upload */}
                      {newGalleryFiles.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded p-3 text-left">
                          <span className="font-bold text-amber-800 text-[10px] uppercase block tracking-wider mb-2">New uploads (Pending save)</span>
                          <div className="flex flex-wrap gap-2">
                            {newGalleryFiles.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-1.5 bg-white border border-amber-200 px-2.5 py-1.5 rounded text-xs text-amber-900 shadow-sm">
                                <span className="max-w-[150px] truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
                                  }}
                                  className="text-red-500 hover:text-red-700 font-bold"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "highlights" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Highlights list editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Highlights Editor ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.highlights || []).map((h, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] bg-gray-100 px-1.5 py-0.5 rounded">Icon: {h.icon}</span>
                            <span className="font-medium text-xs text-[#121212]">{h.label[activeLangTab]}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const highlights = [...(packageForm.highlights || [])];
                              highlights.splice(idx, 1);
                              setPackageForm({ ...packageForm, highlights });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New Highlight</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Icon Type</label>
                          <select id="newHighlightIcon" className="border p-2 rounded bg-white text-xs">
                            <option value="compass">Compass / Sightseeing</option>
                            <option value="boat">Boat / Backwater</option>
                            <option value="sun">Sun / Sunset</option>
                            <option value="camera">Camera / Sightseeing</option>
                            <option value="wave">Wave / Beach</option>
                            <option value="walk">Walk / Trekking</option>
                            <option value="check">Check / Inclusive</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Highlight Text</label>
                          <input type="text" id="newHighlightLabel" placeholder="e.g. Sunset Boat Cruise" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const iconIn = document.getElementById("newHighlightIcon") as HTMLSelectElement;
                          const labelIn = document.getElementById("newHighlightLabel") as HTMLInputElement;
                          if (iconIn && labelIn && labelIn.value.trim()) {
                            const highlights = [...(packageForm.highlights || [])];
                            highlights.push({
                              icon: iconIn.value,
                              label: createEmptyLocalizedText(labelIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, highlights });
                            labelIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Highlight
                      </button>
                    </div>
                  </div>

                  {/* Why Guests Love Us list editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Why Guests Love Us ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.whyGuestsLoveUs || []).map((w, idx) => (
                        <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                          <div>
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[9px] bg-gray-100 px-1.5 py-0.5 rounded inline-block mb-1">Icon: {w.icon}</span>
                            <h5 className="font-serif font-bold text-xs text-[#121212]">{w.title[activeLangTab]}</h5>
                            <p className="text-[10px] text-gray-500 font-light mt-0.5 leading-relaxed font-sans">{w.desc[activeLangTab]}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const whyGuestsLoveUs = [...(packageForm.whyGuestsLoveUs || [])];
                              whyGuestsLoveUs.splice(idx, 1);
                              setPackageForm({ ...packageForm, whyGuestsLoveUs });
                            }}
                            className="text-red-500 shrink-0 mt-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New "Why Guests Love Us" item</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Icon key</label>
                          <select id="newPkgLoveIcon" className="border p-2 rounded bg-white text-xs">
                            <option value="star">Star / Rating</option>
                            <option value="coffee">Coffee / Meals</option>
                            <option value="sunset">Sunset view</option>
                            <option value="chat">Chat / Guide</option>
                            <option value="shield">Shield / Safe</option>
                            <option value="compass">Compass / Adventure</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Title</label>
                          <input type="text" id="newPkgLoveTitle" placeholder="e.g. Guided Experience" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-gray-500 text-[9px] uppercase">Description</label>
                        <textarea id="newPkgLoveDesc" rows={2} placeholder="e.g. Expert guide with rich storytelling." className="border p-2 rounded text-xs font-sans" />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const iconSelect = document.getElementById("newPkgLoveIcon") as HTMLSelectElement;
                          const titleIn = document.getElementById("newPkgLoveTitle") as HTMLInputElement;
                          const descIn = document.getElementById("newPkgLoveDesc") as HTMLTextAreaElement;
                          if (iconSelect && titleIn && descIn && titleIn.value.trim() && descIn.value.trim()) {
                            const whyGuestsLoveUs = [...(packageForm.whyGuestsLoveUs || [])];
                            whyGuestsLoveUs.push({
                              icon: iconSelect.value,
                              title: createEmptyLocalizedText(titleIn.value.trim()),
                              desc: createEmptyLocalizedText(descIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, whyGuestsLoveUs });
                            titleIn.value = "";
                            descIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Item
                      </button>
                    </div>
                  </div>

                  {/* Quick Facts list editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Quick Facts ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.quickFacts || []).map((fact, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2 shadow-sm">
                          <span className="font-medium text-xs">
                            <strong className="text-gray-700">{fact.key[activeLangTab]}:</strong> {fact.value[activeLangTab]}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const quickFacts = [...(packageForm.quickFacts || [])];
                              quickFacts.splice(idx, 1);
                              setPackageForm({ ...packageForm, quickFacts });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add New Quick Fact</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Fact Label / Key</label>
                          <input type="text" id="newFactKey" placeholder="e.g. Best Time" className="border p-2 rounded text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Fact Value</label>
                          <input type="text" id="newFactValue" placeholder="e.g. Morning flow" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const keyIn = document.getElementById("newFactKey") as HTMLInputElement;
                          const valIn = document.getElementById("newFactValue") as HTMLInputElement;
                          if (keyIn && valIn && keyIn.value.trim() && valIn.value.trim()) {
                            const quickFacts = [...(packageForm.quickFacts || [])];
                            quickFacts.push({
                              key: createEmptyLocalizedText(keyIn.value.trim()),
                              value: createEmptyLocalizedText(valIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, quickFacts });
                            keyIn.value = "";
                            valIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Fact
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "checklists" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Inclusions */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Inclusions List ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(packageForm.inclusions || []).map((inc, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <span className="font-medium truncate text-xs text-[#121212]">{inc[activeLangTab]}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const inclusions = [...(packageForm.inclusions || [])];
                              inclusions.splice(idx, 1);
                              setPackageForm({ ...packageForm, inclusions });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm pt-2">
                      <input
                        type="text"
                        id="newInclusionInput"
                        placeholder="e.g. Life jackets / Water bottle"
                        className="border p-2 rounded flex-grow text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (!input.value.trim()) return;
                            const inclusions = [...(packageForm.inclusions || [])];
                            inclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, inclusions });
                            input.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newInclusionInput") as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const inclusions = [...(packageForm.inclusions || [])];
                            inclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, inclusions });
                            input.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Exclusions */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Exclusions List ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(packageForm.exclusions || []).map((exc, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <span className="font-medium truncate text-xs text-[#121212]">{exc[activeLangTab]}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const exclusions = [...(packageForm.exclusions || [])];
                              exclusions.splice(idx, 1);
                              setPackageForm({ ...packageForm, exclusions });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm pt-2">
                      <input
                        type="text"
                        id="newExclusionInput"
                        placeholder="e.g. Gratitude tips"
                        className="border p-2 rounded flex-grow text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (!input.value.trim()) return;
                            const exclusions = [...(packageForm.exclusions || [])];
                            exclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, exclusions });
                            input.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newExclusionInput") as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const exclusions = [...(packageForm.exclusions || [])];
                            exclusions.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, exclusions });
                            input.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Things to bring */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-3">
                    <label className="font-bold text-gray-600 uppercase block">Things to Bring ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(packageForm.thingsToBring || []).map((thing, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2">
                          <span className="font-medium truncate text-xs text-[#121212]">{thing[activeLangTab]}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const thingsToBring = [...(packageForm.thingsToBring || [])];
                              thingsToBring.splice(idx, 1);
                              setPackageForm({ ...packageForm, thingsToBring });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 max-w-sm pt-2">
                      <input
                        type="text"
                        id="newBringInput"
                        placeholder="e.g. Camera / Hat / Sunscreen"
                        className="border p-2 rounded flex-grow text-xs"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            if (!input.value.trim()) return;
                            const thingsToBring = [...(packageForm.thingsToBring || [])];
                            thingsToBring.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, thingsToBring });
                            input.value = "";
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById("newBringInput") as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const thingsToBring = [...(packageForm.thingsToBring || [])];
                            thingsToBring.push(createEmptyLocalizedText(input.value.trim()));
                            setPackageForm({ ...packageForm, thingsToBring });
                            input.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-3.5 py-2 rounded font-semibold uppercase tracking-wider text-[10px]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "itinerary" && (
                <div className="space-y-6 animate-fade-in">
                  {/* Morning / Primary Itinerary editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Morning / Primary Itinerary Steps ({activeLangTab.toUpperCase()})</h4>
                    <div className="flex flex-col gap-3">
                      {(packageForm.itinerary || []).map((step, idx) => (
                        <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                          <div>
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] block">{step.timeOrDay[activeLangTab]}</span>
                            <h5 className="font-serif font-semibold text-xs text-[#121212] mt-1">{step.activity[activeLangTab]}</h5>
                            <p className="text-[11px] text-gray-500 font-light font-sans mt-0.5">{step.desc[activeLangTab]}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const itinerary = [...(packageForm.itinerary || [])];
                              itinerary.splice(idx, 1);
                              setPackageForm({ ...packageForm, itinerary });
                            }}
                            className="text-red-500 mt-1 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end pt-2 border-t border-dashed">
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">Time/Day Label</label>
                        <input type="text" id="newStepTime" placeholder="e.g. 09:00 AM" className="border p-2 rounded w-full text-xs" />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">Activity Label</label>
                        <input type="text" id="newStepActivity" placeholder="e.g. Pick-up" className="border p-2 rounded w-full text-xs" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" id="newStepDesc" placeholder="e.g. Meeting at Villa Lemon..." className="border p-2 rounded flex-grow text-xs" />
                        <button
                          type="button"
                          onClick={() => {
                            const tIn = document.getElementById("newStepTime") as HTMLInputElement;
                            const aIn = document.getElementById("newStepActivity") as HTMLInputElement;
                            const dIn = document.getElementById("newStepDesc") as HTMLInputElement;
                            if (tIn && aIn && dIn && tIn.value.trim() && aIn.value.trim() && dIn.value.trim()) {
                              const itinerary = [...(packageForm.itinerary || [])];
                              itinerary.push({
                                timeOrDay: createEmptyLocalizedText(tIn.value.trim()),
                                activity: createEmptyLocalizedText(aIn.value.trim()),
                                desc: createEmptyLocalizedText(dIn.value.trim())
                              });
                              setPackageForm({ ...packageForm, itinerary });
                              tIn.value = "";
                              aIn.value = "";
                              dIn.value = "";
                            }
                          }}
                          className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider shrink-0 text-[10px]"
                        >
                          Add Step
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Evening Itinerary editor */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Evening Itinerary Steps ({activeLangTab.toUpperCase()})</h4>
                    <div className="flex flex-col gap-3">
                      {(packageForm.itineraryEvening || []).map((step, idx) => (
                        <div key={idx} className="flex items-start justify-between border bg-white p-3 rounded gap-3">
                          <div>
                            <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] block">{step.timeOrDay[activeLangTab]}</span>
                            <h5 className="font-serif font-semibold text-xs text-[#121212] mt-1">{step.activity[activeLangTab]}</h5>
                            <p className="text-[11px] text-gray-500 font-light font-sans mt-0.5">{step.desc[activeLangTab]}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const itineraryEvening = [...(packageForm.itineraryEvening || [])];
                              itineraryEvening.splice(idx, 1);
                              setPackageForm({ ...packageForm, itineraryEvening });
                            }}
                            className="text-red-500 mt-1 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end pt-2 border-t border-dashed">
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">Time/Day Label</label>
                        <input type="text" id="newStepTimeEvening" placeholder="e.g. 03:30 PM" className="border p-2 rounded w-full text-xs" />
                      </div>
                      <div>
                        <label className="font-semibold text-gray-500 block mb-1">Activity Label</label>
                        <input type="text" id="newStepActivityEvening" placeholder="e.g. Pick-up" className="border p-2 rounded w-full text-xs" />
                      </div>
                      <div className="flex gap-2">
                        <input type="text" id="newStepDescEvening" placeholder="e.g. Meeting at Villa Lemon..." className="border p-2 rounded flex-grow text-xs" />
                        <button
                          type="button"
                          onClick={() => {
                            const tIn = document.getElementById("newStepTimeEvening") as HTMLInputElement;
                            const aIn = document.getElementById("newStepActivityEvening") as HTMLInputElement;
                            const dIn = document.getElementById("newStepDescEvening") as HTMLInputElement;
                            if (tIn && aIn && dIn && tIn.value.trim() && aIn.value.trim() && dIn.value.trim()) {
                              const itineraryEvening = [...(packageForm.itineraryEvening || [])];
                              itineraryEvening.push({
                                timeOrDay: createEmptyLocalizedText(tIn.value.trim()),
                                activity: createEmptyLocalizedText(aIn.value.trim()),
                                desc: createEmptyLocalizedText(dIn.value.trim())
                              });
                              setPackageForm({ ...packageForm, itineraryEvening });
                              tIn.value = "";
                              aIn.value = "";
                              dIn.value = "";
                            }
                          }}
                          className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider shrink-0 text-[10px]"
                        >
                          Add Step
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "itinerary" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Nearby Attractions */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Nearby Attractions ({activeLangTab.toUpperCase()})</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                      {(packageForm.nearbyAttractions || []).map((att, idx) => (
                        <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-2 shadow-sm">
                          <span className="font-medium text-xs">
                            <strong className="text-gray-700">{att.name[activeLangTab]}:</strong> {att.distance[activeLangTab]}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const nearbyAttractions = [...(packageForm.nearbyAttractions || [])];
                              nearbyAttractions.splice(idx, 1);
                              setPackageForm({ ...packageForm, nearbyAttractions });
                            }}
                            className="text-red-500 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add Nearby Attraction</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Attraction Name</label>
                          <input type="text" id="newAttName" placeholder="e.g. Varkala Aquarium" className="border p-2 rounded text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Distance</label>
                          <input type="text" id="newAttDistance" placeholder="e.g. 5 km" className="border p-2 rounded text-xs" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nameIn = document.getElementById("newAttName") as HTMLInputElement;
                          const distIn = document.getElementById("newAttDistance") as HTMLInputElement;
                          if (nameIn && distIn && nameIn.value.trim() && distIn.value.trim()) {
                            const nearbyAttractions = [...(packageForm.nearbyAttractions || [])];
                            nearbyAttractions.push({
                              name: createEmptyLocalizedText(nameIn.value.trim()),
                              distance: createEmptyLocalizedText(distIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, nearbyAttractions });
                            nameIn.value = "";
                            distIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add Attraction
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "related" && (
                <div className="space-y-4 animate-fade-in">
                  {/* Related Packages selectors */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Related Packages (You May Also Like)</label>
                    <p className="text-[10px] text-gray-500">Select up to 3 packages to recommend at the bottom of this package's details page.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[0, 1, 2].map((index) => {
                        const currentSelected = packageForm.relatedPackages?.[index] || "";
                        return (
                          <div key={index} className="flex flex-col gap-1.5 bg-white p-3 border rounded shadow-2xs">
                            <label className="font-semibold text-gray-500 uppercase text-[10px]">Recommendation #{index + 1}</label>
                            <select
                              value={currentSelected}
                              onChange={(e) => {
                                const newRelated = [...(packageForm.relatedPackages || [])];
                                while (newRelated.length < 3) {
                                  newRelated.push("");
                                }
                                newRelated[index] = e.target.value;
                                setPackageForm({ ...packageForm, relatedPackages: newRelated });
                              }}
                              className="border border-gray-200 p-2.5 rounded bg-white text-xs mt-1"
                            >
                              <option value="">-- None --</option>
                              <optgroup label="Stays / Accommodations">
                                {stays
                                  .filter((s) => s.slug !== packageForm.slug)
                                  .map((s) => (
                                    <option key={s._id} value={s.slug}>
                                      🏨 {s.title[activeLangTab] || s.title["en"] || s.slug}
                                    </option>
                                  ))}
                              </optgroup>
                              <optgroup label="Tours / Packages">
                                {packages
                                  .filter((p) => p.slug !== packageForm.slug)
                                  .map((p) => (
                                    <option key={p._id} value={p.slug}>
                                      🎒 {p.title[activeLangTab] || p.title["en"] || p.slug}
                                    </option>
                                  ))}
                              </optgroup>
                              <optgroup label="Yoga Programs & Retreats">
                                {yogas
                                  .filter((y) => y.slug !== packageForm.slug)
                                  .map((y) => (
                                    <option key={y._id} value={y.slug}>
                                      🧘 [Class] {y.title[activeLangTab] || y.title["en"] || y.slug}
                                    </option>
                                  ))}
                                {retreats
                                  .filter((r) => r.slug !== packageForm.slug)
                                  .map((r) => (
                                    <option key={r._id} value={r.slug}>
                                      🧘 [Retreat] {r.heroTitle?.[activeLangTab] || r.heroTitle?.["en"] || r.slug}
                                    </option>
                                  ))}
                              </optgroup>
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <label className="font-bold text-gray-600 uppercase block">Frequently Asked Questions ({activeLangTab.toUpperCase()})</label>
                    <div className="flex flex-col gap-3">
                      {(packageForm.faqs || []).map((faq, idx) => (
                        <div key={idx} className="border bg-white p-3 rounded shadow-sm space-y-1 relative">
                          <h5 className="font-bold text-xs text-[#121212]">Q: {faq.question[activeLangTab]}</h5>
                          <p className="text-[11px] text-gray-600 font-light font-sans">A: {faq.answer[activeLangTab]}</p>
                          <button
                            type="button"
                            onClick={() => {
                              const faqs = [...(packageForm.faqs || [])];
                              faqs.splice(idx, 1);
                              setPackageForm({ ...packageForm, faqs });
                            }}
                            className="absolute top-2 right-2 text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-white border rounded p-4 space-y-3 shadow-sm">
                      <span className="font-semibold text-gray-500 text-[10px] uppercase block tracking-wider">Add FAQ Item</span>
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Question</label>
                          <input type="text" id="newFaqQuestion" placeholder="e.g. What is the dress code?" className="border p-2 rounded text-xs" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-gray-500 text-[9px] uppercase">Answer</label>
                          <textarea id="newFaqAnswer" rows={2} placeholder="e.g. Dress modestly when visiting local villages." className="border p-2 rounded text-xs font-sans" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const qIn = document.getElementById("newFaqQuestion") as HTMLInputElement;
                          const aIn = document.getElementById("newFaqAnswer") as HTMLTextAreaElement;
                          if (qIn && aIn && qIn.value.trim() && aIn.value.trim()) {
                            const faqs = [...(packageForm.faqs || [])];
                            faqs.push({
                              question: createEmptyLocalizedText(qIn.value.trim()),
                              answer: createEmptyLocalizedText(aIn.value.trim())
                            });
                            setPackageForm({ ...packageForm, faqs });
                            qIn.value = "";
                            aIn.value = "";
                          }
                        }}
                        className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider text-[10px]"
                      >
                        Add FAQ
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "seo" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                    <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">SEO Meta Parameters ({activeLangTab.toUpperCase()})</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label className="font-bold text-gray-600 uppercase">Meta Title Tag</label>
                        <input
                          type="text"
                          value={packageForm.metaTitle?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const metaTitle = { ...packageForm.metaTitle, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, metaTitle });
                          }}
                          className="border p-2.5 rounded text-xs"
                          placeholder="e.g. Best Varkala Sightseeing Tour | Villa Lemon"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">Meta Description</label>
                        <textarea
                          rows={3}
                          value={packageForm.metaDescription?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const metaDescription = { ...packageForm.metaDescription, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, metaDescription });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                          placeholder="Brief summary of package for search engines..."
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-gray-600 uppercase">SEO Keywords (Comma Separated)</label>
                        <textarea
                          rows={3}
                          value={packageForm.keywords?.[activeLangTab] || ""}
                          onChange={(e) => {
                            const keywords = { ...packageForm.keywords, [activeLangTab]: e.target.value } as any;
                            setPackageForm({ ...packageForm, keywords });
                          }}
                          className="border p-2.5 rounded font-sans text-xs"
                          placeholder="e.g. varkala, sightseeing, day trip, houseboat"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Canonical URL</label>
                      <input
                        type="text"
                        value={packageForm.canonicalUrl || ""}
                        onChange={(e) => setPackageForm({ ...packageForm, canonicalUrl: e.target.value })}
                        className="border p-2.5 rounded text-xs bg-white"
                        placeholder="e.g. https://villalemon.com/packages/varkala-sightseeing"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-gray-600 uppercase">Social Sharing Image (OG Image)</label>
                      <div className="flex items-center gap-3">
                        {ogImagePreview && (
                          <div className="relative w-20 aspect-[12/6.3] rounded border overflow-hidden shrink-0">
                            <img src={ogImagePreview} className="w-full h-full object-cover" alt="SEO Preview" />
                          </div>
                        )}
                        <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                          <Upload className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-500">Upload Social Image</span>
                          <input type="file" accept="image/*" onChange={handleOgImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePkgFormTab === "booking" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Cancellation Rules ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={packageForm.cancellation?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const cancellation = { ...packageForm.cancellation, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, cancellation });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Cancellation policy details..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Refund Terms ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={packageForm.refund?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const refund = { ...packageForm.refund, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, refund });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Refund window and payment terms..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Pickup Location ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={2}
                        value={packageForm.pickup?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const pickup = { ...packageForm.pickup, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, pickup });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Pick up instructions..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-gray-600 uppercase">Dropoff Details ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={2}
                        value={packageForm.drop?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const drop = { ...packageForm.drop, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, drop });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Drop off instructions..."
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="font-bold text-gray-600 uppercase">Important Notes ({activeLangTab.toUpperCase()})</label>
                      <textarea
                        rows={3}
                        value={packageForm.notes?.[activeLangTab] || ""}
                        onChange={(e) => {
                          const notes = { ...packageForm.notes, [activeLangTab]: e.target.value } as any;
                          setPackageForm({ ...packageForm, notes });
                        }}
                        className="border p-2.5 rounded font-sans text-xs"
                        placeholder="Any additional notes or warnings..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPackageModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingPackage} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingPackage ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Package</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: YOGA PROGRAM FORM
      ======================================================== */}
      {showYogaModal && yogaForm.title && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingYoga ? "Edit Yoga Program" : "Create Yoga Program"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure program types, benefits, and schedule</p>
              </div>
              <button onClick={() => setShowYogaModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveYoga} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Program Type</label>
                  <select
                    value={yogaForm.yogaType}
                    onChange={(e) => setYogaForm({ ...yogaForm, yogaType: e.target.value as any })}
                    className="border p-2.5 rounded bg-white"
                  >
                    {yogaCategories.map((cat) => (
                      <option key={cat.type} value={cat.type}>
                        {cat.title[activeLangTab] || cat.title.en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Slug segment (Unique URL)</label>
                  <input
                    type="text"
                    value={yogaForm.slug}
                    onChange={(e) => setYogaForm({ ...yogaForm, slug: e.target.value })}
                    className="border p-2.5 rounded"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Program Price (₹)</label>
                  <input
                    type="number"
                    value={yogaForm.price}
                    onChange={(e) => setYogaForm({ ...yogaForm, price: Number(e.target.value) })}
                    className="border p-2.5 rounded"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="yogaHideRate"
                  checked={yogaForm.hideRate || false}
                  onChange={(e) => setYogaForm({ ...yogaForm, hideRate: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-brand-gold focus:ring-brand-gold"
                />
                <label htmlFor="yogaHideRate" className="font-bold text-gray-700 uppercase cursor-pointer">
                  Hide Price / Rate from Listing Grid
                </label>
              </div>

              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Localized texts ({activeLangTab.toUpperCase()})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Program Title</label>
                    <input
                      type="text"
                      value={yogaForm.title?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const title = { ...yogaForm.title, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, title });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Price Period</label>
                    <input
                      type="text"
                      value={yogaForm.pricePeriod?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const pricePeriod = { ...yogaForm.pricePeriod, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, pricePeriod });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Duration Label</label>
                    <input
                      type="text"
                      value={yogaForm.duration?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const duration = { ...yogaForm.duration, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, duration });
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-gray-600 uppercase">Tagline</label>
                  <input
                    type="text"
                    value={yogaForm.tagline?.[activeLangTab] || ""}
                    onChange={(e) => {
                      const tagline = { ...yogaForm.tagline, [activeLangTab]: e.target.value } as any;
                      setYogaForm({ ...yogaForm, tagline });
                    }}
                    className="border p-2.5 rounded"
                    required={activeLangTab === "en"}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Short Description</label>
                    <textarea
                      rows={3}
                      value={yogaForm.shortDescription?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const shortDescription = { ...yogaForm.shortDescription, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, shortDescription });
                      }}
                      className="border p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Full Description (About Text)</label>
                    <textarea
                      rows={3}
                      value={yogaForm.aboutText?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const aboutText = { ...yogaForm.aboutText, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, aboutText });
                      }}
                      className="border p-2.5 rounded font-sans"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>
              </div>

              {/* Image Uploads */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <label className="font-bold text-gray-600 uppercase">Cover Banner Image(s) (Upload multiple for slideshow)</label>
                  <div className="flex flex-col gap-3">
                    {coverImagePreviews && coverImagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {coverImagePreviews.map((url, idx) => (
                          <div key={idx} className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0 group">
                            <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                            <button
                              type="button"
                              onClick={() => handleDeleteCoverImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                              title="Remove image"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-500">Upload Cover Image(s)</span>
                      <input type="file" accept="image/*" multiple onChange={handleCoverImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <label className="font-bold text-gray-600 uppercase">Details Section Image(s) (Multiple for Slideshow)</label>
                  <div className="flex flex-col gap-3">
                    {aboutImagePreviews && aboutImagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {aboutImagePreviews.map((url, idx) => (
                          <div key={idx} className="relative w-20 aspect-[4/3] rounded border overflow-hidden shrink-0 group bg-gray-50">
                            <img src={url} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                            <button
                              type="button"
                              onClick={() => handleDeleteAboutImage(idx)}
                              className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-md transition-colors leading-none z-10"
                              title="Remove image"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-500">Upload Detail Image(s)</span>
                      <input type="file" accept="image/*" multiple onChange={handleAboutImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Schedule list editor */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">Daily Schedule ({activeLangTab.toUpperCase()})</h4>
                <div className="flex flex-col gap-3">
                  {(yogaForm.schedule || []).map((sc, idx) => (
                    <div key={idx} className="flex items-center justify-between border bg-white p-2.5 rounded gap-3">
                      <div>
                        <span className="font-bold text-brand-gold uppercase tracking-wider text-[10px] block">{sc.time?.[activeLangTab]}</span>
                        <h5 className="font-serif font-semibold text-xs text-[#121212] mt-1">{sc.activity?.[activeLangTab]}</h5>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const schedule = [...(yogaForm.schedule || [])];
                          schedule.splice(idx, 1);
                          setYogaForm({ ...yogaForm, schedule });
                        }}
                        className="text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 max-w-xl">
                  <input type="text" id="newScheduleTime" placeholder="e.g. 06:30 AM" className="border p-2 rounded w-1/3" />
                  <input type="text" id="newScheduleActivity" placeholder="e.g. Sunrise Yoga Flow" className="border p-2 rounded flex-grow" />
                  <button
                    type="button"
                    onClick={() => {
                      const tIn = document.getElementById("newScheduleTime") as HTMLInputElement;
                      const aIn = document.getElementById("newScheduleActivity") as HTMLInputElement;
                      if (tIn && aIn && tIn.value.trim() && aIn.value.trim()) {
                        const schedule = [...(yogaForm.schedule || [])];
                        schedule.push({
                          time: createEmptyLocalizedText(tIn.value.trim()),
                          activity: createEmptyLocalizedText(aIn.value.trim())
                        });
                        setYogaForm({ ...yogaForm, schedule });
                        tIn.value = "";
                        aIn.value = "";
                      }
                    }}
                    className="bg-[#121212] text-white px-4 py-2 rounded font-bold uppercase tracking-wider shrink-0"
                  >
                    Add Schedule Block
                  </button>
                </div>
              </div>

              {/* SECTION: RELATED YOGA PROGRAMS */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">You May Also Like (Related Yoga Programs)</h4>
                <p className="text-[10px] text-gray-500">Select up to 3 yoga programs to recommend at the bottom of this program's details page.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => {
                    const currentSelected = yogaForm.relatedYoga?.[index] || "";
                    return (
                      <div key={index} className="flex flex-col gap-1.5 bg-white p-3 border rounded shadow-2xs">
                        <label className="font-semibold text-gray-500 uppercase text-[10px]">Recommendation #{index + 1}</label>
                        <select
                          value={currentSelected}
                          onChange={(e) => {
                            const newRelated = [...(yogaForm.relatedYoga || [])];
                            while (newRelated.length < 3) {
                              newRelated.push("");
                            }
                            newRelated[index] = e.target.value;
                            setYogaForm({ ...yogaForm, relatedYoga: newRelated });
                          }}
                          className="border border-gray-200 p-2.5 rounded bg-white text-xs mt-1"
                        >
                          <option value="">-- None --</option>
                          <optgroup label="Stays / Accommodations">
                            {stays
                              .filter((s) => s.slug !== yogaForm.slug)
                              .map((s) => (
                                <option key={s._id} value={s.slug}>
                                  🏨 {s.title[activeLangTab] || s.title["en"] || s.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Tours / Packages">
                            {packages
                              .filter((p) => p.slug !== yogaForm.slug)
                              .map((p) => (
                                <option key={p._id} value={p.slug}>
                                  🎒 {p.title[activeLangTab] || p.title["en"] || p.slug}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="Yoga Programs & Retreats">
                            {yogas
                              .filter((y) => y.slug !== yogaForm.slug)
                              .map((y) => (
                                <option key={y._id} value={y.slug}>
                                  🧘 [Class] {y.title[activeLangTab] || y.title["en"] || y.slug}
                                </option>
                              ))}
                            {retreats
                              .filter((r) => r.slug !== yogaForm.slug)
                              .map((r) => (
                                <option key={r._id} value={r.slug}>
                                  🧘 [Retreat] {r.heroTitle?.[activeLangTab] || r.heroTitle?.["en"] || r.slug}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: SEO METADATA */}
              <div className="bg-gray-50 p-4 rounded border border-gray-100 space-y-4">
                <h4 className="font-bold text-[#121212] uppercase tracking-wider border-b pb-1.5">SEO & Social Metadata ({activeLangTab.toUpperCase()})</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Meta Title Tag</label>
                    <input
                      type="text"
                      value={yogaForm.metaTitle?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const metaTitle = { ...yogaForm.metaTitle, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, metaTitle });
                      }}
                      className="border border-gray-200 p-2.5 rounded text-xs bg-white"
                      placeholder="e.g. Varkala Yoga Classes | Hatha & Vinyasa Flow"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Canonical URL link</label>
                    <input
                      type="text"
                      value={yogaForm.canonicalUrl || ""}
                      onChange={(e) => setYogaForm({ ...yogaForm, canonicalUrl: e.target.value })}
                      className="border border-gray-200 p-2.5 rounded text-xs bg-white"
                      placeholder="e.g. https://villalemon.com/yoga/classes/hatha-flow"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Meta Description tag</label>
                    <textarea
                      rows={3}
                      value={yogaForm.metaDescription?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const metaDescription = { ...yogaForm.metaDescription, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, metaDescription });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans text-xs bg-white"
                      placeholder="Describe the yoga program details for search engines..."
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">SEO Keywords tag</label>
                    <textarea
                      rows={3}
                      value={yogaForm.keywords?.[activeLangTab] || ""}
                      onChange={(e) => {
                        const keywords = { ...yogaForm.keywords, [activeLangTab]: e.target.value } as any;
                        setYogaForm({ ...yogaForm, keywords });
                      }}
                      className="border border-gray-200 p-2.5 rounded font-sans text-xs bg-white"
                      placeholder="e.g. yoga varkala, yoga ashram, wellness stay kerala"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowYogaModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingYoga} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingYoga ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Program</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: YOGA TEACHER FORM
      ======================================================== */}
      {showTeacherModal && teacherForm.role && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">
                  {editingTeacher ? "Edit Teacher Profile" : "Create Teacher Profile"}
                </h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure profile photo, name, and localized bio</p>
              </div>
              <button onClick={() => setShowTeacherModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveTeacher} className="flex-grow overflow-y-auto p-6 space-y-5 text-xs">
              
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase">Teacher's Full Name</label>
                <input
                  type="text"
                  value={teacherForm.name || ""}
                  onChange={(e) => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  placeholder="e.g. Acharya Vishnu"
                  className="border p-2.5 rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase">Role / Specialty ({activeLangTab.toUpperCase()})</label>
                <input
                  type="text"
                  value={teacherForm.role?.[activeLangTab] || ""}
                  onChange={(e) => {
                    const role = { ...teacherForm.role, [activeLangTab]: e.target.value } as any;
                    setTeacherForm({ ...teacherForm, role });
                  }}
                  placeholder="e.g. Lead Yoga Acharya & Meditation Guide"
                  className="border p-2.5 rounded"
                  required={activeLangTab === "en"}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase">Short Bio ({activeLangTab.toUpperCase()})</label>
                <textarea
                  rows={4}
                  value={teacherForm.bio?.[activeLangTab] || ""}
                  onChange={(e) => {
                    const bio = { ...teacherForm.bio, [activeLangTab]: e.target.value } as any;
                    setTeacherForm({ ...teacherForm, bio });
                  }}
                  placeholder="Brief description of experience and mindfulness background..."
                  className="border p-2.5 rounded font-sans"
                  required={activeLangTab === "en"}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-gray-600 uppercase">Profile Picture Photo</label>
                <div className="flex items-center gap-3">
                  {coverImagePreview && (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border bg-gray-100 shrink-0">
                      <img src={coverImagePreview} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                  <label className="flex-grow border-2 border-dashed border-gray-300 hover:border-brand-gold rounded p-4 text-center cursor-pointer flex flex-col items-center gap-1 bg-white hover:bg-gray-50">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-500">Upload Profile Photo</span>
                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingTeacher} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingTeacher ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Profile</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: HOMEPAGE TEXT EDITOR (STATIC CONTENT)
      ======================================================== */}
      {showHomepageModal && homepageData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-[#121212] text-white">
              <div>
                <h3 className="font-serif text-lg tracking-wide">Homepage Translation Editor</h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-1">Configure static localized landing blocks</p>
              </div>
              <button onClick={() => setShowHomepageModal(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50 flex gap-2">
              {(["en", "de", "fr", "ru"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all duration-200 ${
                    activeLangTab === lang ? "bg-brand-gold text-black shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {lang === "en" ? "🇬🇧 EN" : lang === "de" ? "🇩🇪 DE" : lang === "fr" ? "🇫🇷 FR" : "🇷🇺 RU"}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveHomepage} className="flex-grow overflow-y-auto p-6 space-y-6 text-xs">
              
              <div className="space-y-4">
                <h4 className="font-serif text-sm font-semibold border-b pb-2 text-brand-gold uppercase tracking-wider">Hero Section</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Tagline</label>
                    <input
                      type="text"
                      value={homepageData.hero.tagline[activeLangTab]}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        copy.hero.tagline[activeLangTab] = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Heading part 1</label>
                    <input
                      type="text"
                      value={homepageData.hero.headingPart1[activeLangTab]}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        copy.hero.headingPart1[activeLangTab] = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded"
                      required={activeLangTab === "en"}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-5 mt-5 text-left">
                <h4 className="font-serif text-sm font-semibold border-b pb-2 text-brand-gold uppercase tracking-wider">Contact Information (Global)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={homepageData.contact?.phone || ""}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        if (!copy.contact) copy.contact = { address: "", phone: "", whatsapp: "", email: "", receptionHours: "" };
                        copy.contact.phone = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded text-xs text-gray-800"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">WhatsApp Number</label>
                    <input
                      type="text"
                      value={homepageData.contact?.whatsapp || ""}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        if (!copy.contact) copy.contact = { address: "", phone: "", whatsapp: "", email: "", receptionHours: "" };
                        copy.contact.whatsapp = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded text-xs text-gray-800"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Email Address</label>
                    <input
                      type="email"
                      value={homepageData.contact?.email || ""}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        if (!copy.contact) copy.contact = { address: "", phone: "", whatsapp: "", email: "", receptionHours: "" };
                        copy.contact.email = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded text-xs text-gray-800"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-gray-600 uppercase">Reception Hours</label>
                    <input
                      type="text"
                      value={homepageData.contact?.receptionHours || ""}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        if (!copy.contact) copy.contact = { address: "", phone: "", whatsapp: "", email: "", receptionHours: "" };
                        copy.contact.receptionHours = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded text-xs text-gray-800"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="font-bold text-gray-600 uppercase">Physical Address</label>
                    <textarea
                      value={homepageData.contact?.address || ""}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        if (!copy.contact) copy.contact = { address: "", phone: "", whatsapp: "", email: "", receptionHours: "" };
                        copy.contact.address = e.target.value;
                        setHomepageData(copy);
                      }}
                      rows={2}
                      className="border p-2.5 rounded text-xs text-gray-800"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="font-bold text-gray-600 uppercase">Google Maps Link (Embed or Direct URL)</label>
                    <input
                      type="url"
                      value={homepageData.contact?.googleMapsLink || ""}
                      onChange={(e) => {
                        const copy = { ...homepageData };
                        if (!copy.contact) copy.contact = { address: "", phone: "", whatsapp: "", email: "", receptionHours: "", googleMapsLink: "" };
                        copy.contact.googleMapsLink = e.target.value;
                        setHomepageData(copy);
                      }}
                      className="border p-2.5 rounded text-xs text-gray-800"
                      placeholder="https://maps.google.com/?q=... or google.com/maps/embed?pb=..."
                    />
                    <div className="mt-1.5 space-y-1">
                      <p className="text-[10px] text-gray-500 font-medium">📍 <strong>Directions button</strong>: paste any share link (e.g. <code className="bg-gray-100 px-1 rounded">maps.app.goo.gl/...</code> or <code className="bg-gray-100 px-1 rounded">maps.google.com/?q=...</code>)</p>
                      <p className="text-[10px] text-gray-500 font-medium">🗺️ <strong>Map preview embed</strong>: to update the embedded map, paste the <code className="bg-gray-100 px-1 rounded">src="..."</code> URL from Google Maps → Share → Embed a map. It must start with <code className="bg-gray-100 px-1 rounded">google.com/maps/embed?pb=</code></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-150 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHomepageModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded hover:bg-gray-100 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button type="submit" disabled={savingHomepage} className="px-6 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-black font-bold rounded uppercase tracking-wider flex items-center gap-2">
                  {savingHomepage ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Landing Content</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ADD GALLERY ITEM
      ======================================================== */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-lg w-full flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-brand-dark text-white">
              <div>
                <h3 className="font-serif text-base tracking-wide text-left">Upload Gallery Image</h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-0.5 text-left">Add a new image to the global gallery catalog</p>
              </div>
              <button onClick={() => setShowGalleryModal(false)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGalleryItem} className="p-6 space-y-4 text-xs">
              {/* Image upload field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase text-left">Gallery Image File</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-brand-gold p-4 rounded-md cursor-pointer flex-grow bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">{galleryFile ? galleryFile.name : "Choose Gallery File..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setGalleryFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setGalleryFilePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {galleryFilePreview && (
                    <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden shrink-0 select-none bg-gray-50">
                      <img src={galleryFilePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Category dropdown */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-gray-600 uppercase">Gallery Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  className="border p-2 rounded focus:ring-1 focus:ring-brand-gold text-xs"
                  required
                >
                  <option value="villa-accommodation">Villa & Accommodation</option>
                  <option value="yoga-wellness">Yoga & Wellness</option>
                  <option value="experiences-tours">Experiences & Tours</option>
                  <option value="food-dining">Food & Dining</option>
                  <option value="nature-surroundings">Nature & Surroundings</option>
                  <option value="events-culture">Events & Culture</option>
                </select>
              </div>

              {/* Localized Captions */}
              <div className="space-y-3 pt-2 border-t text-left">
                <span className="font-bold text-gray-500 uppercase block mb-1">Image Captions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">English Caption</label>
                    <input
                      type="text"
                      value={galleryForm.caption.en}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: { ...galleryForm.caption, en: e.target.value } })}
                      className="border p-2 rounded text-xs"
                      placeholder="e.g. Beautiful garden path..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">German Caption</label>
                    <input
                      type="text"
                      value={galleryForm.caption.de}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: { ...galleryForm.caption, de: e.target.value } })}
                      className="border p-2 rounded text-xs"
                      placeholder="deutsches Bildunterschrift"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">French Caption</label>
                    <input
                      type="text"
                      value={galleryForm.caption.fr}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: { ...galleryForm.caption, fr: e.target.value } })}
                      className="border p-2 rounded text-xs"
                      placeholder="légende en français"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">Russian Caption</label>
                    <input
                      type="text"
                      value={galleryForm.caption.ru}
                      onChange={(e) => setGalleryForm({ ...galleryForm, caption: { ...galleryForm.caption, ru: e.target.value } })}
                      className="border p-2 rounded text-xs"
                      placeholder="подпись на русском"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-150 pt-4 flex items-center justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-sm hover:bg-gray-100 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingGallery}
                  className="px-5 py-2 bg-brand-dark hover:bg-brand-dark-soft text-white font-bold rounded-sm uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  {isUploadingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Upload Image</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT GALLERY ITEM
      ======================================================== */}
      {showEditGalleryModal && editingGalleryItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto select-text text-left">
          <div className="bg-white rounded-md max-w-lg w-full flex flex-col shadow-2xl border border-gray-150">
            
            <div className="p-5 border-b border-gray-150 flex items-center justify-between bg-brand-dark text-white animate-fade-in">
              <div>
                <h3 className="font-serif text-base tracking-wide text-left">Edit Gallery Image</h3>
                <p className="text-[10px] text-brand-gold tracking-widest uppercase mt-0.5 text-left">Modify details or replace image</p>
              </div>
              <button
                onClick={() => {
                  setShowEditGalleryModal(false);
                  setEditingGalleryItem(null);
                  setEditGalleryFile(null);
                  setEditGalleryFilePreview(null);
                }}
                className="p-1 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGalleryItem} className="p-6 space-y-4 text-xs">
              {/* Image upload field */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-gray-600 uppercase text-left">Replace Gallery Image (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-brand-gold p-4 rounded-md cursor-pointer flex-grow bg-gray-50 hover:bg-gray-100/50 transition-colors">
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500 font-medium">{editGalleryFile ? editGalleryFile.name : "Choose New File..."}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setEditGalleryFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditGalleryFilePreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  {editGalleryFilePreview && (
                    <div className="w-16 h-16 rounded border border-gray-200 overflow-hidden shrink-0 select-none bg-gray-50">
                      <img src={editGalleryFilePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Category dropdown */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-gray-600 uppercase">Gallery Category</label>
                <select
                  value={editingGalleryItem.category}
                  onChange={(e) => setEditingGalleryItem({ ...editingGalleryItem, category: e.target.value })}
                  className="border p-2 rounded focus:ring-1 focus:ring-brand-gold text-xs"
                  required
                >
                  <option value="villa-accommodation">Villa & Accommodation</option>
                  <option value="yoga-wellness">Yoga & Wellness</option>
                  <option value="experiences-tours">Experiences & Tours</option>
                  <option value="food-dining">Food & Dining</option>
                  <option value="nature-surroundings">Nature & Surroundings</option>
                  <option value="events-culture">Events & Culture</option>
                </select>
              </div>

              {/* Localized Captions */}
              <div className="space-y-3 pt-2 border-t text-left">
                <span className="font-bold text-gray-500 uppercase block mb-1">Image Captions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">English Caption</label>
                    <input
                      type="text"
                      value={editingGalleryItem.caption.en || ""}
                      onChange={(e) => setEditingGalleryItem({
                        ...editingGalleryItem,
                        caption: { ...editingGalleryItem.caption, en: e.target.value }
                      })}
                      className="border p-2 rounded text-xs"
                      placeholder="e.g. Beautiful garden path..."
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">German Caption</label>
                    <input
                      type="text"
                      value={editingGalleryItem.caption.de || ""}
                      onChange={(e) => setEditingGalleryItem({
                        ...editingGalleryItem,
                        caption: { ...editingGalleryItem.caption, de: e.target.value }
                      })}
                      className="border p-2 rounded text-xs"
                      placeholder="deutsches Bildunterschrift"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">French Caption</label>
                    <input
                      type="text"
                      value={editingGalleryItem.caption.fr || ""}
                      onChange={(e) => setEditingGalleryItem({
                        ...editingGalleryItem,
                        caption: { ...editingGalleryItem.caption, fr: e.target.value }
                      })}
                      className="border p-2 rounded text-xs"
                      placeholder="légende en français"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-gray-600 uppercase text-[9px]">Russian Caption</label>
                    <input
                      type="text"
                      value={editingGalleryItem.caption.ru || ""}
                      onChange={(e) => setEditingGalleryItem({
                        ...editingGalleryItem,
                        caption: { ...editingGalleryItem.caption, ru: e.target.value }
                      })}
                      className="border p-2 rounded text-xs"
                      placeholder="подпись на русском"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-150 pt-4 flex items-center justify-end gap-3 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditGalleryModal(false);
                    setEditingGalleryItem(null);
                    setEditGalleryFile(null);
                    setEditGalleryFilePreview(null);
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-sm hover:bg-gray-100 font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingGallery}
                  className="px-5 py-2 bg-brand-dark hover:bg-brand-dark-soft text-white font-bold rounded-sm uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  {isUpdatingGallery ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Save Changes</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  getCategories,
  getSubcategories,
  getSocialPlatforms,
} from "@/app/actions/(socialmood)/social.actions";

interface FiltersProps {
  onFilterChange: (filters: {
    category: string;
    subcategory: string;
    network: string;
    ruleType: string;
  }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const t = useTranslations("socialmood.dashboard.filters");
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [networks, setNetworks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedRuleType, setSelectedRuleType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, networksData] = await Promise.all([
          getCategories(),
          getSocialPlatforms(),
        ]);
        setCategories(categoriesData);
        setNetworks(networksData);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const subcategoriesData = await getSubcategories(selectedCategory);
          setSubcategories(subcategoriesData);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);

  const handleApplyFilters = () => {
    onFilterChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      network: selectedNetwork,
      ruleType: selectedRuleType,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedNetwork("");
    setSelectedRuleType("");
    onFilterChange({
      category: "",
      subcategory: "",
      network: "",
      ruleType: "",
    });
  };

  return (
    <div className="space-y-4 p-4 bg-[#2C2436] rounded-lg">
      <h2 className="text-xl font-semibold mb-4">{t("title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t("category")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedSubcategory}
          onValueChange={setSelectedSubcategory}
          disabled={!selectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("subcategory")} />
          </SelectTrigger>
          <SelectContent>
            {subcategories.map((subcategory) => (
              <SelectItem key={subcategory} value={subcategory}>
                {subcategory}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
          <SelectTrigger>
            <SelectValue placeholder={t("network")} />
          </SelectTrigger>
          <SelectContent>
            {networks.map((network) => (
              <SelectItem key={network} value={network}>
                {network}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRuleType} onValueChange={setSelectedRuleType}>
          <SelectTrigger>
            <SelectValue placeholder={t("ruleType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="automatic">Automatic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleClearFilters}>
          {t("clear")}
        </Button>
        <Button onClick={handleApplyFilters}>{t("apply")}</Button>
      </div>
    </div>
  );
}

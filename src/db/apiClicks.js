import { UAParser } from "ua-parser-js";
import supabase from "./supabase";

// GET ALL CLICKS FOR MULTIPLE URLS
export async function getClicksForUrls(urlIds) {
  if (!urlIds || urlIds.length === 0) return [];

  const { data, error } = await supabase
    .from("Clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return [];
  }

  return data;
}

// GET CLICKS FOR SINGLE URL
export async function getClicksForUrl(url_id) {
  const { data, error } = await supabase
    .from("Clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

// STORE CLICK
export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const res = parser.getResult();

    const device = res.device.type || "desktop";

    const response = await fetch("https://ipapi.co/json");

    const { city, country_name: country } = await response.json();

    await supabase.from("Clicks").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
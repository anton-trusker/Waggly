import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createAuthenticatedClient } from "../_shared/supabase-client.ts";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib@1.17.1?dts";
import QRCode from "https://esm.sh/qrcode@1.5.1";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name, x-supabase-auth",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Base64 Logo (Waggli)
const LOGO_BASE64 = "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";

const COLORS = {
    PRIMARY: rgb(0.17, 0.04, 0.5),   // #2C097F Waggli Purple
    ACCENT: rgb(0.06, 0.73, 0.51),    // #10b981 Waggli Green
    TEXT_MAIN: rgb(0.12, 0.16, 0.23), // #1F2937 Gray 800
    TEXT_SEC: rgb(0.4, 0.45, 0.53),   // #6B7280 Gray 500
    BORDER: rgb(0.88, 0.9, 0.94),     // #E5E7EB Gray 200
    BG_LIGHT: rgb(0.97, 0.98, 0.99),  // #F9FAFB Gray 50
};

serve(async (req) => {
    if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

    try {
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) throw new Error("Missing Authorization header");
        const token = authHeader.replace("Bearer ", "");
        const supabase = createAuthenticatedClient(token);

        const { petId } = await req.json();
        if (!petId) throw new Error("Missing petId");

        // 1. Fetch Comprehensive Data
        const { data: pet, error: petError } = await supabase
            .from("pets")
            .select(`
                *,
                profiles:user_id (first_name, last_name, phone, email),
                health_scores (overall_score, score_category, created_at),
                body_condition_scores (score, category, assessed_date)
            `)
            .eq("id", petId)
            .single();

        if (petError || !pet) throw new Error(`Error fetching pet: ${petError?.message || "Pet not found"}`);

        const { data: vaccinations } = await supabase.from("vaccinations").select("*").eq("pet_id", pet.id).order("date_given", { ascending: false });
        // treatments table is 'medications' in V2 and unused here, removing.
        const { data: conditions } = await supabase.from("conditions").select("*").eq("pet_id", pet.id).order("diagnosed_date", { ascending: false });
        const { data: contacts } = await supabase.from("emergency_contacts").select("*").eq("pet_id", pet.id).order("is_primary", { ascending: false });

        // 2. Setup PDF document
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([595.28, 841.89]); // A4
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const margin = 50;
        let currentY = height - margin;

        // --- Header Section ---
        // Logo
        try {
            const logoImage = await pdfDoc.embedPng(LOGO_BASE64);
            const logoDims = logoImage.scale(0.15);
            page.drawImage(logoImage, {
                x: margin,
                y: currentY - logoDims.height,
                width: logoDims.width,
                height: logoDims.height,
            });
        } catch (e) { console.error("Logo embed failed", e); }

        page.drawText("OFFICIAL PET PASSPORT", {
            x: margin + 80,
            y: currentY - 25,
            size: 20,
            font: fontBold,
            color: COLORS.PRIMARY,
        });
        page.drawText("Generated by Waggli - Your Trusted Pet Care Partner", {
            x: margin + 80,
            y: currentY - 40,
            size: 10,
            font: font,
            color: COLORS.TEXT_SEC,
        });

        currentY -= 70;
        page.drawLine({ start: { x: margin, y: currentY }, end: { x: width - margin, y: currentY }, thickness: 1, color: COLORS.BORDER });
        currentY -= 30;

        // --- Pet Identification & Photo Area ---
        const drawSectionHeader = (title: string, y: number) => {
            page.drawRectangle({ x: margin, y: y - 5, width: width - 2 * margin, height: 25, color: COLORS.BG_LIGHT });
            page.drawText(title.toUpperCase(), { x: margin + 10, y: y + 5, size: 12, font: fontBold, color: COLORS.PRIMARY });
            return y - 35;
        };

        currentY = drawSectionHeader("Pet Identification", currentY);

        // Grid-like layout for ID
        const col1 = margin + 10;
        const col2 = margin + 250;

        const drawInfoRow = (label: string, value: string, y: number, x: number) => {
            page.drawText(`${label}:`, { x, y, size: 10, font: fontBold, color: COLORS.TEXT_SEC });
            page.drawText(value || "N/A", { x: x + 80, y, size: 11, font: font, color: COLORS.TEXT_MAIN });
        };

        drawInfoRow("Name", pet.name, currentY, col1);
        drawInfoRow("ID", pet.passport_id, currentY, col2);
        currentY -= 20;
        drawInfoRow("Species", pet.species, currentY, col1);
        drawInfoRow("Breed", pet.breed, currentY, col2);
        currentY -= 20;
        drawInfoRow("Gender", pet.gender, currentY, col1);
        drawInfoRow("DOB", pet.date_of_birth, currentY, col2);
        currentY -= 20;
        drawInfoRow("Microchip", pet.microchip_number, currentY, col1);
        drawInfoRow("Owner", `${pet.profiles?.first_name || ""} ${pet.profiles?.last_name || ""}`, currentY, col2);
        currentY -= 40;

        // --- Physical Traits ---
        currentY = drawSectionHeader("Physical Attributes", currentY);
        drawInfoRow("Coat", pet.coat_type, currentY, col1);
        drawInfoRow("Fur", pet.fur_description, currentY, col2);
        currentY -= 20;
        drawInfoRow("Eyes", pet.eye_color, currentY, col1);
        drawInfoRow("Tail", pet.tail_length, currentY, col2);
        currentY -= 40;

        // --- Medical Summary ---
        currentY = drawSectionHeader("Medical Records & Vaccinations", currentY);

        // Vaccinations Table
        page.drawText("Recent Vaccinations", { x: margin + 10, y: currentY, size: 11, font: fontBold, color: COLORS.TEXT_MAIN });
        currentY -= 15;
        const tableHeaderY = currentY;
        page.drawText("Vaccine", { x: margin + 15, y: currentY, size: 9, font: fontBold });
        page.drawText("Date Given", { x: margin + 180, y: currentY, size: 9, font: fontBold });
        page.drawText("Next Due", { x: margin + 300, y: currentY, size: 9, font: fontBold });
        currentY -= 5;
        page.drawLine({ start: { x: margin + 10, y: currentY }, end: { x: width - margin - 10, y: currentY }, thickness: 0.5, color: COLORS.BORDER });
        currentY -= 15;

        for (const v of (vaccinations || []).slice(0, 5)) {
            page.drawText(v.vaccine_name || "-", { x: margin + 15, y: currentY, size: 9, font: font });
            page.drawText(v.date_given || "-", { x: margin + 180, y: currentY, size: 9, font: font });
            page.drawText(v.next_due_date || "-", { x: margin + 300, y: currentY, size: 9, font: font });
            currentY -= 15;
        }
        currentY -= 20;

        // Conditions
        if (conditions?.length) {
            page.drawText("Medical Conditions", { x: margin + 10, y: currentY, size: 11, font: fontBold, color: COLORS.TEXT_MAIN });
            currentY -= 15;
            for (const c of conditions.slice(0, 3)) {
                page.drawText(`• ${c.name} (${c.status}) - Diagnosed: ${c.diagnosed_date}`, { x: margin + 15, y: currentY, size: 9, font: font });
                currentY -= 12;
            }
            currentY -= 20;
        }

        // --- Emergency Contacts ---
        currentY = drawSectionHeader("Emergency Contacts", currentY);
        if (contacts?.length) {
            for (const c of contacts.slice(0, 2)) {
                page.drawText(c.name || "Unknown", { x: margin + 10, y: currentY, size: 10, font: fontBold });
                page.drawText(`${c.relationship || ""} | ${c.phone || ""}`, { x: margin + 180, y: currentY, size: 10, font: font });
                currentY -= 15;
            }
        }
        currentY -= 30;

        // --- Footer & QR Verification ---
        const footerY = 100;
        page.drawLine({ start: { x: margin, y: footerY }, end: { x: width - margin, y: footerY }, thickness: 1, color: COLORS.BORDER });

        try {
            const qrUrl = `https://waggli.app/p/verify/${pet.passport_id}`;
            const qrDataUrl = await QRCode.toDataURL(qrUrl);
            const qrImage = await pdfDoc.embedPng(qrDataUrl);
            page.drawImage(qrImage, { x: width - margin - 80, y: 30, width: 60, height: 60 });
            page.drawText("SCAN TO VERIFY", { x: width - margin - 85, y: 20, size: 8, font: fontBold, color: COLORS.TEXT_SEC });
        } catch (e) { console.error("QR fail", e); }

        page.drawText("This document is an official digital passport for the identified pet.", { x: margin, y: 70, size: 8, font: font, color: COLORS.TEXT_SEC });
        page.drawText("Waggli Inc. | www.waggli.app | Secure Pet Travel & Health Records", { x: margin, y: 55, size: 8, font: font, color: COLORS.PRIMARY });

        const pdfBytes = await pdfDoc.save();

        return new Response(pdfBytes, {
            headers: {
                ...corsHeaders,
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${pet.name}_Passport.pdf"`,
            },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }
});

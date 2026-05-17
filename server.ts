import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Setup directories
  const DATA_DIR = path.join(__dirname, "data-storage");
  const BOOKINGS_DIR = path.join(DATA_DIR, "bookings");
  const CONTACTS_DIR = path.join(DATA_DIR, "contacts");

  await fs.ensureDir(BOOKINGS_DIR);
  await fs.ensureDir(CONTACTS_DIR);

  // API Routes
  app.post("/api/save-booking", async (req, res) => {
    try {
      const data = req.body;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const status = 'new';
      const filename = `booking_${timestamp}_${status}_${data.phone || 'unknown'}.json`;
      const filePath = path.join(BOOKINGS_DIR, filename);
      
      const fileData = {
        ...data,
        id: filename,
        createdAt: new Date().toISOString(),
        status: status
      };

      await fs.writeJson(filePath, fileData, { spaces: 2 });
      res.json({ success: true, id: filename });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save booking" });
    }
  });

  app.post("/api/save-contact", async (req, res) => {
    try {
      const data = req.body;
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const status = 'new';
      const filename = `contact_${timestamp}_${status}_${data.phone || 'unknown'}.json`;
      const filePath = path.join(CONTACTS_DIR, filename);

      const fileData = {
        ...data,
        id: filename,
        createdAt: new Date().toISOString(),
        status: status
      };

      await fs.writeJson(filePath, fileData, { spaces: 2 });
      res.json({ success: true, id: filename });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save contact" });
    }
  });

  app.post("/api/admin-login", (req, res) => {
    const { username, password } = req.body;
    // Hardcoded credentials as requested for predefined ID/password
    if (username === "admin_anandam" && password === "ayurveda2024") {
      res.json({ success: true, token: "fake-jwt-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/data", async (req, res) => {
    try {
      const bookingFiles = await fs.readdir(BOOKINGS_DIR);
      const contactFiles = await fs.readdir(CONTACTS_DIR);

      const bookings = await Promise.all(
        bookingFiles.map(file => fs.readJson(path.join(BOOKINGS_DIR, file)))
      );
      const contacts = await Promise.all(
        contactFiles.map(file => fs.readJson(path.join(CONTACTS_DIR, file)))
      );

      res.json({ bookings, contacts });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  });

  app.post("/api/admin/delete-item", async (req, res) => {
    try {
      const { id, type } = req.body;
      const dir = type === 'booking' ? BOOKINGS_DIR : CONTACTS_DIR;
      const filePath = path.join(dir, id);

      if (await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  app.post("/api/admin/update-status", async (req, res) => {
    try {
      const { id, type, status } = req.body;
      const dir = type === 'booking' ? BOOKINGS_DIR : CONTACTS_DIR;
      const oldFilePath = path.join(dir, id);

      if (await fs.pathExists(oldFilePath)) {
        const data = await fs.readJson(oldFilePath);
        
        data.status = status;
        data.updatedAt = new Date().toISOString();
        
        const parts = id.split('_');
        if (parts.length >= 4) {
          parts[2] = status;
          const newFilename = parts.join('_');
          const newFilePath = path.join(dir, newFilename);
          
          data.id = newFilename;
          
          await fs.writeJson(newFilePath, data, { spaces: 2 });
          if (oldFilePath !== newFilePath) {
            await fs.remove(oldFilePath);
          }
          res.json({ success: true, newId: newFilename });
        } else {
          await fs.writeJson(oldFilePath, data, { spaces: 2 });
          res.json({ success: true });
        }
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.post("/api/admin/bulk-delete", async (req, res) => {
    try {
      const { ids, type } = req.body;
      const dir = type === 'booking' ? BOOKINGS_DIR : CONTACTS_DIR;
      
      for (const id of ids) {
        const filePath = path.join(dir, id);
        if (await fs.pathExists(filePath)) {
          await fs.remove(filePath);
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to perform bulk deletion" });
    }
  });

  app.post("/api/admin/bulk-update-status", async (req, res) => {
    try {
      const { ids, type, status } = req.body;
      const dir = type === 'booking' ? BOOKINGS_DIR : CONTACTS_DIR;
      
      for (const id of ids) {
        const oldFilePath = path.join(dir, id);
        if (await fs.pathExists(oldFilePath)) {
          const data = await fs.readJson(oldFilePath);
          data.status = status;
          data.updatedAt = new Date().toISOString();
          
          const parts = id.split('_');
          if (parts.length >= 4) {
            parts[2] = status;
            const newFilename = parts.join('_');
            const newFilePath = path.join(dir, newFilename);
            data.id = newFilename;
            await fs.writeJson(newFilePath, data, { spaces: 2 });
            if (oldFilePath !== newFilePath) {
              await fs.remove(oldFilePath);
            }
          } else {
            await fs.writeJson(oldFilePath, data, { spaces: 2 });
          }
        }
      }
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to perform bulk status update" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

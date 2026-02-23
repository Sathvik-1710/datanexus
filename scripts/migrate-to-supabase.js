require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase credentials missing in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
    console.log("🚀 Starting Migration: Markdown files -> Supabase Database");

    // 1. Migrate Team Members
    console.log("\n👥 Migrating Team Members...");
    const teamDir = path.join(process.cwd(), 'content/team');
    if (fs.existsSync(teamDir)) {
        const files = fs.readdirSync(teamDir).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const slug = file.replace('.md', '');
            const content = fs.readFileSync(path.join(teamDir, file), 'utf8');
            const { data } = matter(content);

            const { error } = await supabase.from('team').upsert({
                slug,
                name: data.name || 'Unknown',
                role: data.role || 'Member',
                photo: data.photo || null,
                bio: data.bio || null,
                linkedin: data.linkedin || null,
                order: data.order || 0
            }, { onConflict: 'slug' });

            if (error) console.error(`❌ Failed to migrate team member ${slug}:`, error.message);
            else console.log(`✅ Migrated team member: ${slug}`);
        }
    }

    // 2. Migrate Events
    console.log("\n📅 Migrating Events...");
    const eventsDir = path.join(process.cwd(), 'content/events');
    if (fs.existsSync(eventsDir)) {
        const files = fs.readdirSync(eventsDir).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const slug = file.replace('.md', '');
            const content = fs.readFileSync(path.join(eventsDir, file), 'utf8');
            const { data, content: body } = matter(content);

            // Clean images array
            let images = data.images || [];
            if (typeof images === 'string') images = [images];

            const { error } = await supabase.from('events').upsert({
                slug,
                title: data.title || 'Untitled Event',
                date: data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                images: images,
                description: data.description || body.trim() || null
            }, { onConflict: 'slug' });

            if (error) console.error(`❌ Failed to migrate event ${slug}:`, error.message);
            else console.log(`✅ Migrated event: ${slug}`);
        }
    }

    // 3. Migrate Faculty
    console.log("\n🎓 Migrating Faculty...");
    const facultyDir = path.join(process.cwd(), 'content/faculty');
    if (fs.existsSync(facultyDir)) {
        const files = fs.readdirSync(facultyDir).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const slug = file.replace('.md', '');
            const content = fs.readFileSync(path.join(facultyDir, file), 'utf8');
            const { data } = matter(content);

            const { error } = await supabase.from('faculty').upsert({
                slug,
                name: data.name || 'Unknown',
                designation: data.designation || 'Faculty',
                photo: data.photo || null,
                is_hod: data.isHOD === true,
                order: data.order || 0
            }, { onConflict: 'slug' });

            if (error) console.error(`❌ Failed to migrate faculty ${slug}:`, error.message);
            else console.log(`✅ Migrated faculty: ${slug}`);
        }
    }

    // 4. Migrate Settings
    console.log("\n⚙️ Migrating Settings...");
    const settingsFile = path.join(process.cwd(), 'content/settings/general.md');
    if (fs.existsSync(settingsFile)) {
        const content = fs.readFileSync(settingsFile, 'utf8');
        const { data } = matter(content);

        const { error } = await supabase.from('settings').upsert({
            id: 'general',
            tagline: data.tagline,
            years_active: data.years_active,
            founded_year: data.founded_year,
            instagram: data.instagram,
            linkedin: data.linkedin,
            github: data.github
        });

        if (error) console.error(`❌ Failed to migrate settings:`, error.message);
        else console.log(`✅ Migrated general settings`);
    }

    console.log("\n✨ Migration Finished!");
}

migrate();

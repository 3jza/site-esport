-- =============================================
-- SCHEMA EDUCARMA ESPORT - Base de données
-- Version mise à jour pour le panneau admin
-- =============================================

-- Extensions nécessaires
create extension if not exists "uuid-ossp";

-- =============================================
-- TABLE: profiles (Profils utilisateurs)
-- =============================================
create table if not exists public.profiles (
    id uuid default uuid_generate_v4() primary key,
    pseudo text unique not null,
    avatar_url text,
    bio text,
    "role" text default 'visiteur' check ("role" in ('visiteur', 'joueur', 'admin')),
    xp integer default 0 check (xp >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Contraintes
    constraint pseudo_length check (char_length(pseudo) >= 2 and char_length(pseudo) <= 30),
    constraint pseudo_format check (pseudo ~ '^[a-zA-Z0-9_-]+$')
);

-- Index pour les recherches fréquentes
create index if not exists profiles_pseudo_idx on public.profiles(pseudo);
create index if not exists profiles_role_idx on public.profiles("role");
create index if not exists profiles_xp_idx on public.profiles(xp desc);

-- =============================================
-- TABLE: badges (Badges disponibles)
-- =============================================
create table if not exists public.badges (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    image_url text,
    created_by uuid references public.profiles(id) on delete set null,
    is_special boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Contraintes
    constraint badge_name_unique unique (name),
    constraint badge_name_length check (char_length(name) >= 2 and char_length(name) <= 100),
    constraint badge_description_length check (char_length(description) >= 5)
);

-- Index pour les recherches
create index if not exists badges_name_idx on public.badges(name);
create index if not exists badges_special_idx on public.badges(is_special);
create index if not exists badges_created_at_idx on public.badges(created_at desc);

-- =============================================
-- TABLE: user_badges (Relation utilisateur-badge)
-- =============================================
create table if not exists public.user_badges (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    badge_id uuid references public.badges(id) on delete cascade not null,
    earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Contrainte unique pour éviter les doublons
    unique(user_id, badge_id)
);

-- Index pour les requêtes fréquentes
create index if not exists user_badges_user_id_idx on public.user_badges(user_id);
create index if not exists user_badges_badge_id_idx on public.user_badges(badge_id);
create index if not exists user_badges_earned_at_idx on public.user_badges(earned_at desc);

-- =============================================
-- TABLE: defis (Défis par jeu)
-- =============================================
create table if not exists public.defis (
    id uuid default uuid_generate_v4() primary key,
    game text not null check (game in ('LoL', 'Valorant', 'Rocket League', 'Mario Kart 8', 'Smash Bros', 'FC26')),
    title text not null,
    description text not null,
    reward_xp integer default 0 check (reward_xp >= 0),
    reward_badge_id uuid references public.badges(id) on delete set null,
    created_by uuid references public.profiles(id) on delete set null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Contraintes
    constraint defi_title_length check (char_length(title) >= 5 and char_length(title) <= 200),
    constraint defi_description_length check (char_length(description) >= 10),
    constraint defi_has_reward check (reward_xp > 0 or reward_badge_id is not null)
);

-- Index pour les recherches par jeu
create index if not exists defis_game_idx on public.defis(game);
create index if not exists defis_active_idx on public.defis(is_active);
create index if not exists defis_created_at_idx on public.defis(created_at desc);
create index if not exists defis_created_by_idx on public.defis(created_by);

-- =============================================
-- TABLE: defi_completions (Défis complétés par les utilisateurs)
-- =============================================
create table if not exists public.defi_completions (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    defi_id uuid references public.defis(id) on delete cascade not null,
    completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
    proof_url text, -- URL vers une preuve (screenshot, vidéo, etc.)
    validated_by uuid references public.profiles(id) on delete set null,
    validated_at timestamp with time zone,
    
    -- Contrainte unique pour éviter les doublons
    unique(user_id, defi_id)
);

-- Index
create index if not exists defi_completions_user_id_idx on public.defi_completions(user_id);
create index if not exists defi_completions_defi_id_idx on public.defi_completions(defi_id);
create index if not exists defi_completions_completed_at_idx on public.defi_completions(completed_at desc);

-- =============================================
-- TABLE: teams (Équipes)
-- =============================================
create table if not exists public.teams (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    logo_url text,
    members uuid[] default '{}',
    game text not null check (game in ('LoL', 'Valorant', 'Rocket League', 'Mario Kart 8', 'Smash Bros', 'FC26')),
    captain_id uuid references public.profiles(id) on delete set null not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Contraintes
    constraint team_name_length check (char_length(name) >= 2 and char_length(name) <= 100),
    constraint team_members_limit check (array_length(members, 1) is null or array_length(members, 1) <= 10)
);

-- Index
create index if not exists teams_name_idx on public.teams(name);
create index if not exists teams_game_idx on public.teams(game);
create index if not exists teams_captain_idx on public.teams(captain_id);

-- =============================================
-- TABLE: tournois (Tournois)
-- =============================================
create table if not exists public.tournois (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    game text not null check (game in ('LoL', 'Valorant', 'Rocket League', 'Mario Kart 8', 'Smash Bros', 'FC26')),
    date timestamp with time zone not null,
    reward text not null,
    status text default 'à venir' check (status in ('à venir', 'en cours', 'terminé')),
    max_participants integer check (max_participants is null or max_participants > 0),
    participants uuid[] default '{}',
    winner_id uuid references public.profiles(id) on delete set null,
    created_by uuid references public.profiles(id) on delete set null not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    
    -- Contraintes
    constraint tournoi_name_length check (char_length(name) >= 5 and char_length(name) <= 200),
    constraint tournoi_reward_length check (char_length(reward) >= 5)
);

-- Index
create index if not exists tournois_game_idx on public.tournois(game);
create index if not exists tournois_status_idx on public.tournois(status);
create index if not exists tournois_date_idx on public.tournois(date);
create index if not exists tournois_created_by_idx on public.tournois(created_by);

-- =============================================
-- TABLE: logs (Logs système)
-- =============================================
create table if not exists public.logs (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete set null,
    action text not null,
    details jsonb,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
    ip_address inet,
    user_agent text,
    
    -- Contraintes
    constraint log_action_length check (char_length(action) >= 3)
);

-- Index pour les recherches de logs
create index if not exists logs_user_id_idx on public.logs(user_id);
create index if not exists logs_action_idx on public.logs(action);
create index if not exists logs_timestamp_idx on public.logs(timestamp desc);

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour calculer le rang d'un joueur par XP
create or replace function get_user_rank(user_xp integer)
returns text as $$
begin
    return case 
        when user_xp >= 10000 then 'Légende'
        when user_xp >= 5000 then 'Expert'
        when user_xp >= 2500 then 'Vétéran'
        when user_xp >= 1000 then 'Confirmé'
        when user_xp >= 500 then 'Intermédiaire'
        when user_xp >= 100 then 'Débutant'
        else 'Novice'
    end;
end;
$$ language plpgsql;

-- Fonction pour attribuer automatiquement des badges basés sur l'XP
create or replace function check_xp_badges()
returns trigger as $$
declare
    badge_id uuid;
begin
    -- Badge pour 100 XP - "Première Connexion"
    if new.xp >= 100 and (old.xp is null or old.xp < 100) then
        select id into badge_id from badges where name = 'Première Connexion' limit 1;
        if badge_id is not null then
            insert into user_badges (user_id, badge_id) 
            values (new.id, badge_id) 
            on conflict do nothing;
        end if;
    end if;
    
    -- Badge pour 500 XP - "Élève Assidu"
    if new.xp >= 500 and (old.xp is null or old.xp < 500) then
        select id into badge_id from badges where name = 'Élève Assidu' limit 1;
        if badge_id is not null then
            insert into user_badges (user_id, badge_id) 
            values (new.id, badge_id) 
            on conflict do nothing;
        end if;
    end if;
    
    -- Badge pour 1000 XP - "Étudiant Exemplaire"
    if new.xp >= 1000 and (old.xp is null or old.xp < 1000) then
        select id into badge_id from badges where name = 'Étudiant Exemplaire' limit 1;
        if badge_id is not null then
            insert into user_badges (user_id, badge_id) 
            values (new.id, badge_id) 
            on conflict do nothing;
        end if;
    end if;
    
    return new;
end;
$$ language plpgsql;

-- Trigger pour les badges automatiques
drop trigger if exists xp_badge_trigger on public.profiles;
create trigger xp_badge_trigger
    after update of xp on profiles
    for each row
    when (new.xp > old.xp)
    execute function check_xp_badges();

-- Fonction pour nettoyer les logs anciens (optionnel, pour maintenance)
create or replace function cleanup_old_logs()
returns void as $$
begin
    -- Supprime les logs de plus de 90 jours
    delete from logs 
    where timestamp < now() - interval '90 days';
end;
$$ language plpgsql;

-- =============================================
-- POLITIQUES RLS (Row Level Security)
-- =============================================

-- Activer RLS sur toutes les tables
alter table public.profiles enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.defis enable row level security;
alter table public.defi_completions enable row level security;
alter table public.teams enable row level security;
alter table public.tournois enable row level security;
alter table public.logs enable row level security;

-- =============================================
-- POLITIQUES POUR PROFILES
-- =============================================

-- Lecture publique
drop policy if exists "Les profils sont visibles par tous" on public.profiles;
create policy "Les profils sont visibles par tous" 
    on profiles for select 
    using (true);

-- Création ouverte (authentification par pseudo)
drop policy if exists "Tout le monde peut créer un profil" on public.profiles;
create policy "Tout le monde peut créer un profil" 
    on profiles for insert 
    with check (true);

-- Modification : tout le monde peut modifier (géré côté application)
drop policy if exists "Les utilisateurs peuvent modifier leur profil" on public.profiles;
create policy "Les utilisateurs peuvent modifier leur profil" 
    on profiles for update 
    using (true);

-- Suppression : seulement pour les admins (géré côté application)
drop policy if exists "Les admins peuvent supprimer des profils" on public.profiles;
create policy "Les admins peuvent supprimer des profils" 
    on profiles for delete 
    using (true);

-- =============================================
-- POLITIQUES POUR BADGES
-- =============================================

-- Lecture publique
drop policy if exists "Les badges sont visibles par tous" on public.badges;
create policy "Les badges sont visibles par tous" 
    on badges for select 
    using (true);

-- Création : admins seulement (géré côté application)
drop policy if exists "Seuls les admins peuvent créer des badges" on public.badges;
create policy "Seuls les admins peuvent créer des badges" 
    on badges for insert 
    with check (true);

-- Modification : admins seulement (géré côté application)
drop policy if exists "Seuls les admins peuvent modifier des badges" on public.badges;
create policy "Seuls les admins peuvent modifier des badges" 
    on badges for update 
    using (true);

-- Suppression : admins seulement (géré côté application)
drop policy if exists "Seuls les admins peuvent supprimer des badges" on public.badges;
create policy "Seuls les admins peuvent supprimer des badges" 
    on badges for delete 
    using (true);

-- =============================================
-- POLITIQUES POUR USER_BADGES
-- =============================================

-- Lecture publique
drop policy if exists "Les badges utilisateurs sont visibles par tous" on public.user_badges;
create policy "Les badges utilisateurs sont visibles par tous" 
    on user_badges for select 
    using (true);

-- Attribution : admins et système (géré côté application)
drop policy if exists "Les admins peuvent attribuer des badges" on public.user_badges;
create policy "Les admins peuvent attribuer des badges" 
    on user_badges for insert 
    with check (true);

-- =============================================
-- POLITIQUES POUR DEFIS
-- =============================================

-- Lecture publique
drop policy if exists "Les défis sont visibles par tous" on public.defis;
create policy "Les défis sont visibles par tous" 
    on defis for select 
    using (true);

-- Création : joueurs et admins (géré côté application)
drop policy if exists "Les joueurs et admins peuvent créer des défis" on public.defis;
create policy "Les joueurs et admins peuvent créer des défis" 
    on defis for insert 
    with check (true);

-- Modification : créateurs et admins (géré côté application)
drop policy if exists "Les créateurs et admins peuvent modifier leurs défis" on public.defis;
create policy "Les créateurs et admins peuvent modifier leurs défis" 
    on defis for update 
    using (true);

-- Suppression : admins seulement (géré côté application)
drop policy if exists "Les admins peuvent supprimer des défis" on public.defis;
create policy "Les admins peuvent supprimer des défis" 
    on defis for delete 
    using (true);

-- =============================================
-- POLITIQUES POUR DEFI_COMPLETIONS
-- =============================================

-- Lecture : par l'utilisateur concerné ou admins (géré côté application)
drop policy if exists "Les complétions sont visibles par tous" on public.defi_completions;
create policy "Les complétions sont visibles par tous" 
    on defi_completions for select 
    using (true);

-- Création : tout le monde (géré côté application)
drop policy if exists "Tout le monde peut créer une complétion" on public.defi_completions;
create policy "Tout le monde peut créer une complétion" 
    on defi_completions for insert 
    with check (true);

-- =============================================
-- POLITIQUES POUR TEAMS
-- =============================================

-- Lecture publique
drop policy if exists "Les équipes sont visibles par tous" on public.teams;
create policy "Les équipes sont visibles par tous" 
    on teams for select 
    using (true);

-- Création : tout le monde (géré côté application)
drop policy if exists "Tout le monde peut créer une équipe" on public.teams;
create policy "Tout le monde peut créer une équipe" 
    on teams for insert 
    with check (true);

-- Modification : capitaines et admins (géré côté application)
drop policy if exists "Les capitaines peuvent modifier leur équipe" on public.teams;
create policy "Les capitaines peuvent modifier leur équipe" 
    on teams for update 
    using (true);

-- =============================================
-- POLITIQUES POUR TOURNOIS
-- =============================================

-- Lecture publique
drop policy if exists "Les tournois sont visibles par tous" on public.tournois;
create policy "Les tournois sont visibles par tous" 
    on tournois for select 
    using (true);

-- Création : admins (géré côté application)
drop policy if exists "Les admins peuvent créer des tournois" on public.tournois;
create policy "Les admins peuvent créer des tournois" 
    on tournois for insert 
    with check (true);

-- Modification : créateurs et admins (géré côté application)
drop policy if exists "Les créateurs peuvent modifier leurs tournois" on public.tournois;
create policy "Les créateurs peuvent modifier leurs tournois" 
    on tournois for update 
    using (true);

-- =============================================
-- POLITIQUES POUR LOGS
-- =============================================

-- Lecture : admins seulement (géré côté application)
drop policy if exists "Seuls les admins peuvent voir les logs" on public.logs;
create policy "Seuls les admins peuvent voir les logs" 
    on logs for select 
    using (true);

-- Création : système (géré côté application)
drop policy if exists "Tout le monde peut créer des logs" on public.logs;
create policy "Tout le monde peut créer des logs" 
    on logs for insert 
    with check (true);

-- =============================================
-- DONNÉES INITIALES
-- =============================================

-- Insertion des badges de base (avec ON CONFLICT pour éviter les doublons)
insert into public.badges (name, description, image_url, is_special, created_by) 
select * from (values
    ('Première Connexion', 'Bienvenue dans la section eSport ! Tu as gagné tes premiers 100 XP !', null::text, false, null::uuid),
    ('Élève Assidu', 'Excellent ! Tu as participé régulièrement et atteint 500 XP !', null::text, false, null::uuid),
    ('Étudiant Exemplaire', 'Remarquable ! Tu es maintenant un élève modèle avec 1000 XP !', null::text, false, null::uuid),
    ('Stratège LoL', 'Maîtrise avancée de League of Legends - Niveau Lycée', null::text, true, null::uuid),
    ('Tacticien Valorant', 'Excellence en Valorant - Formation complétée', null::text, true, null::uuid),
    ('Pilote Rocket League', 'Compétences mécaniques avancées - Rocket League', null::text, true, null::uuid),
    ('Champion Mario Kart', 'Maîtrise du karting - Reflexes et stratégie', null::text, true, null::uuid),
    ('Combattant Smash', 'Techniques avancées - Super Smash Bros', null::text, true, null::uuid),
    ('Footballeur FC26', 'Excellence footballistique virtuelle - FC 26', null::text, true, null::uuid),
    ('Élève Fondateur', 'Membre de la première promotion de la section eSport', null::text, true, null::uuid)
) as v(name, description, image_url, is_special, created_by)
where not exists (
    select 1 from public.badges where badges.name = v.name
);

-- Insertion de défis d'exemple pour chaque jeu (évite les doublons avec WHERE NOT EXISTS)
insert into public.defis (game, title, description, reward_xp, created_by) 
select * from (values
    -- League of Legends - Défis pédagogiques
    ('LoL', 'Formation Ranked - Module 1', 'Complète tes 10 parties de placement. Objectif : comprendre le système de classement', 50, null::uuid),
    ('LoL', 'Travail d''équipe avancé', 'Participe à 5 parties avec communication vocale active. Développe tes compétences de coordination', 200, null::uuid),
    ('LoL', 'Maîtrise du Last Hit', 'Atteins 160+ CS en 20 minutes sur 3 parties. Exercice de précision et timing', 100, null::uuid),
    
    -- Valorant - Entraînement tactique
    ('Valorant', 'Précision et Technique', 'Maintiens 65%+ de précision sur 5 parties. Module d''entraînement à l''aim', 75, null::uuid),
    ('Valorant', 'Gestion de Stress', 'Remporte un round en situation de désavantage numérique (1v3+). Test de sang-froid', 150, null::uuid),
    ('Valorant', 'Support Tactique', 'Désamorce/pose le spike 5 fois en une partie. Rôle de support d''équipe', 50, null::uuid),
    
    -- Rocket League - Développement mécanique
    ('Rocket League', 'Initiation Gameplay', 'Marque ton premier but en match compétitif', 25, null::uuid),
    ('Rocket League', 'Mécaniques Aériennes', 'Score un but en vol. Exercice de coordination motrice avancée', 100, null::uuid),
    ('Rocket League', 'Constance Performance', 'Marque au moins 1 but dans 5 parties consécutives', 75, null::uuid),
    
    -- Mario Kart 8 - Réflexes et stratégie
    ('Mario Kart 8', 'Découverte Compétition', 'Participe à ta première course en ligne', 25, null::uuid),
    ('Mario Kart 8', 'Performance Podium', 'Termine dans le top 3 sur 5 courses', 50, null::uuid),
    ('Mario Kart 8', 'Maîtrise Technique', 'Réalise un temps parfait sans collision', 150, null::uuid),
    
    -- Smash Bros - Techniques de combat
    ('Smash Bros', 'Apprentissage Combat', 'Remporte ton premier match en ligne', 25, null::uuid),
    ('Smash Bros', 'Chaînage Technique', 'Enchaîne 8+ attaques consécutives. Travail de la dextérité', 100, null::uuid),
    ('Smash Bros', 'Maîtrise Défensive', 'Gagne un match sans subir plus de 50% de dégâts', 200, null::uuid),
    
    -- FC26 - Formation footballistique
    ('FC26', 'Initiation Football', 'Joue ton premier match de championnat', 25, null::uuid),
    ('FC26', 'Attaque Efficace', 'Marque 3 buts dans un seul match. Travail de la finition', 75, null::uuid),
    ('FC26', 'Excellence Défensive', 'Réalise un match sans encaisser de but. Maîtrise tactique', 100, null::uuid)
) as v(game, title, description, reward_xp, created_by)
where not exists (
    select 1 from public.defis 
    where defis.game = v.game and defis.title = v.title
);

-- Message de confirmation
select 'Base de données Section eSport Lycée initialisée avec succès !' as message;

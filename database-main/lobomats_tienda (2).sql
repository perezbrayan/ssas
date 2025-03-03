-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 03-02-2025 a las 16:36:31
-- Versión del servidor: 10.6.18-MariaDB-cll-lve
-- Versión de PHP: 8.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `lobomats_tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_super_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `is_super_admin`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@example.com', '$2b$10$Tu3mYPKdOinGZbnzalXKSe9SWwVkhnUrGdW4yiz/Ccib9r/r9txQu', 1, '2024-12-28 20:06:17', '2024-12-28 20:06:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '001_initial_admin.js', 1, '2024-12-28 20:06:14'),
(2, '20250111_create_settings.js', 2, '2025-01-11 22:50:44'),
(3, '001_create_users_table.js', 3, '2025-01-15 00:03:44'),
(4, '20240114_create_roblox_table.js', 3, '2025-01-15 00:03:44'),
(5, '20250114_create_vbucks_rates.js', 3, '2025-01-15 00:03:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `executed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `name`, `executed_at`) VALUES
(1, '001_create_users_table.ts', '2024-12-28 19:35:29'),
(2, '20240110_add_username_to_users', '2025-01-11 00:37:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roblox_products`
--

CREATE TABLE `roblox_products` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `roblox_products`
--

INSERT INTO `roblox_products` (`id`, `title`, `description`, `price`, `image_url`, `amount`, `type`, `created_at`, `updated_at`) VALUES
(5, 'ROBLOX PRUEBA', 'compra ', 30000.00, '/uploads/products/product-1737223120083-946728553.png', 1, 'gamepass', '2025-01-18 17:58:40', '2025-01-18 17:58:40'),
(6, '200 robux', '200 robux', 20000.00, '/uploads/products/product-1737247623527-976998972.jpg', 1, 'gamepass', '2025-01-19 00:47:03', '2025-01-19 00:47:03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `vbucks_rate` decimal(10,2) NOT NULL DEFAULT 2200.00,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `settings`
--

INSERT INTO `settings` (`id`, `vbucks_rate`, `last_updated`, `created_at`) VALUES
(1, 2200.00, '2025-01-15 00:44:26', '2025-01-11 23:42:09'),
(2, 2200.00, '2025-01-15 00:44:26', '2025-01-11 23:42:30'),
(3, 2200.00, '2025-01-15 00:44:26', '2025-01-11 23:42:39'),
(4, 2200.00, '2025-01-15 00:44:26', '2025-01-11 23:55:36'),
(5, 2200.00, '2025-01-15 00:44:26', '2025-01-11 23:57:12'),
(6, 2200.00, '2025-01-15 00:44:26', '2025-01-12 00:00:25'),
(7, 2200.00, '2025-01-15 00:44:26', '2025-01-14 23:08:38'),
(8, 2200.00, '2025-01-15 00:44:26', '2025-01-14 23:09:26'),
(9, 2200.00, '2025-01-15 00:44:26', '2025-01-14 23:13:39'),
(10, 2200.00, '2025-01-15 00:44:26', '2025-01-14 23:14:10'),
(11, 2200.00, '2025-01-15 00:44:26', '2025-01-14 23:19:16'),
(12, 3200.00, '2025-01-15 07:29:21', '2025-01-15 07:29:21'),
(13, 2200.00, '2025-01-15 09:45:04', '2025-01-15 09:45:04'),
(14, 4200.00, '2025-01-15 09:45:24', '2025-01-15 09:45:24'),
(15, 5200.00, '2025-01-15 20:02:26', '2025-01-15 20:02:26'),
(16, 10000.00, '2025-01-15 20:05:57', '2025-01-15 20:05:57'),
(17, 2200.00, '2025-01-15 20:12:31', '2025-01-15 20:12:31'),
(18, 2200.00, '2025-01-15 20:14:41', '2025-01-15 20:14:41'),
(19, 20000.00, '2025-01-15 20:29:15', '2025-01-15 20:29:15'),
(20, 2200.00, '2025-01-15 20:38:36', '2025-01-15 20:38:36'),
(21, 2400.00, '2025-01-15 20:38:40', '2025-01-15 20:38:40'),
(22, 2200.00, '2025-01-15 23:08:25', '2025-01-15 23:08:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `is_admin`, `created_at`) VALUES
(1, 'zAngel90', 'av020431@gmail.com', '$2b$10$WEfT2ogEGgPnDc4P8MolOOnIQPLtWI.RHW3LWMW/O38CyRDxaesUy', 0, '2024-12-28 19:48:24'),
(2, 'prueba5839xd', 'prueba3940@gmail.com', '$2b$10$EpudFauTyMVfiImcfDu1m.G9RXiHWkUAyQz56YZgR2xgAfODWW2JK', 0, '2024-12-28 19:54:03'),
(3, 'angel', 'dsksf@gmail.com', '$2b$10$zV4SlUYjD79F0g9C3p3el.GbADfZK0xY5g3zAUEVVy/L93Wb46Q4y', 0, '2025-01-11 01:24:33'),
(4, 'Angel367xX', 'prueba9039404@gmail.com', '$2b$10$u3fzB/QpBQEVGKlKlci8Seyqx2AnARBquAsif33RYqGZBRwpAXFJa', 0, '2025-01-11 02:39:52'),
(5, 'sfsdfsf', 'djaskdjaksd@gmail.com', '$2b$10$yfyrqG0PGrzpuXVDK2J/JOaCm0aOKG9KLJfuWGDa7RNznd5rrwOC.', 0, '2025-01-12 02:00:10'),
(6, 'ffbgfbfbf', 'dkadkad@gmail.com', '$2b$10$0Ig82mIPJZcu9CiaJRBrCOY5kQb3XGxnlKAFAkq9Kdhk1lchrkt8i', 0, '2025-01-14 04:09:38'),
(7, 'kllkl', 'kclxzklklzc@gmail.com', '$2b$10$RgpeLobL30jOSY982qg55e9tmArtpKKwPJt.51i4sJ18P.rJsi6oq', 0, '2025-01-14 16:47:57'),
(9, 'juanda_', 'jdkajkxjakx@gmail.com', '$2b$10$UJxiXqhBZaSV6DJSqNL1K.KlA/VSR3wweLyKZqynEaGfSpIJ1XTTO', 0, '2025-01-20 03:50:57'),
(10, 'ckzkcz', 'sjkajdkad@gmail.com', '$2b$10$bxNKS30SgJ/ha7MBqwPHHetklMpZICMC8A0Ndu4U8f4.68MbV6kU.', 0, '2025-01-20 03:51:33'),
(11, 'papo12589', 'rafaeljose280509@gmail.com', '$2b$10$A0HuEmdPQJirVPHUzCBmiOOiIS.T356Ev.X1DCY/6sF.F7opygC6C', 0, '2025-01-20 16:39:56'),
(12, 'gmstore06', 'milianjoseromero@gmail.com', '$2b$10$OW9lIjwsK9slxVpQM5WkmePcKAajK.5zzhnDCzpd9CtZfPYL/swJK', 0, '2025-01-27 16:01:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vbucks_rates`
--

CREATE TABLE `vbucks_rates` (
  `id` int(10) UNSIGNED NOT NULL,
  `rate` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_username_unique` (`username`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indices de la tabla `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `roblox_products`
--
ALTER TABLE `roblox_products`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vbucks_rates`
--
ALTER TABLE `vbucks_rates`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `roblox_products`
--
ALTER TABLE `roblox_products`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `vbucks_rates`
--
ALTER TABLE `vbucks_rates`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

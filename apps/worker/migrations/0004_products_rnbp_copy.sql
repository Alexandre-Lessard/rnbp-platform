-- Return to the RNBP name (T28): product copy that named the service "Badge".
-- "Badge" stays where it names the code printed on the stickers. Matched on the
-- exact current text, so a product an admin has since edited is left alone.
UPDATE `products` SET
  `name_fr` = 'Collant de protection RNBP',
  `name_en` = 'RNBP Protection Sticker',
  `description_fr` = 'Pour fenêtres et portes. Signalez que vos biens sont enregistrés et protégés par le RNBP, comme les autocollants de compagnie de systèmes d''alarme. Effet dissuasif prouvé.',
  `description_en` = 'For windows and doors. Indicate that your property is registered and protected by RNBP, similar to security system company stickers. Proven deterrent effect.'
WHERE `slug` = 'door-sticker' AND `name_fr` = 'Collant de protection Badge';
--> statement-breakpoint
UPDATE `products` SET
  `description_fr` = replace(`description_fr`, 'dans le Badge (Badge),', 'dans le Registre national des biens personnels (RNBP).'),
  `description_en` = replace(`description_en`, 'in the Badge (Badge).', 'in the National Registry of Personal Property (RNBP).')
WHERE `slug` = 'sticker-sheet';


import React from 'react';
import { awardsData } from '../awardsData';
import { useTranslation } from 'react-i18next';
import './Certificacoes.css';


export default function Premios() {
	const { t, i18n } = useTranslation();
	const lang = i18n.language.startsWith('en') ? 'en' : 'pt';
	if (!awardsData.length) {
		return <div><h2>{t('premios.titulo', 'Prêmios')}</h2><p>{t('premios.nenhum', 'Nenhum prêmio cadastrado ainda.')}</p></div>;
	}
	return (
		<div>
			<h2 style={{ marginBottom: 24 }}>{t('premios.titulo', 'Prêmios')}</h2>
			{awardsData.map((award, idx) => (
				<div className="premio-sobre-container" key={idx}>
					{award.image && (
						<div className="premio-avatar-container">
							<a href={award.link || '#'} target="_blank" rel="noopener noreferrer">
								<img src={award.image} alt={award.title} className="premio-avatar-image" />
							</a>
						</div>
					)}
					<div className="premio-info-container">
						<div className="experience-title" style={{ fontWeight: 'bold', fontSize: 18 }}>{t(`premios.${award.title}.titulo`, award.title)}</div>
						<div className="experience-company">{t(`premios.${award.title}.org`, award.organization)}</div>
						{award.year && <div className="experience-period">{award.year}</div>}
						{award.description && <div style={{ margin: '8px 0' }}>{t(`premios.${award.title}.desc`, award.description)}</div>}
									{award.link && (
										<a href={award.link} className="experience-link" target="_blank" rel="noopener noreferrer" style={{ color: '#a78bfa', textDecoration: 'underline', display: 'inline-block', marginTop: 8 }}>
											<span role="img" aria-label="link">🔗</span> {t('premios.link', 'Ver no Link')}
										</a>
									)}
					</div>
				</div>
			))}
		</div>
	);
}

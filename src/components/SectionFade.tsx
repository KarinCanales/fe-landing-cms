import styles from './SectionFade.module.css';

type SectionFadeVariant =
  | 'darkToLight'
  | 'lightToDark'
  | 'darkToWarm'
  | 'warmToDark'
  | 'catalogHeader';

type SectionFadeProps = {
  variant: SectionFadeVariant;
};

export default function SectionFade({ variant }: SectionFadeProps) {
  return <div className={`${styles.fade} ${styles[variant]}`} aria-hidden="true" />;
}

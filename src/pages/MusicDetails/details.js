import MusicCard from "../../components/MusicCard";

export default function Details(props) {
  const { music = {} } = props;
  return (
    <>
      <MusicCard music={music} type="details" />
    </>
  );
}

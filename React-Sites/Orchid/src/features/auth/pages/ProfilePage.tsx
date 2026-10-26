import { useParams } from "react-router-dom"
import ProfileContent from "../components/ProfileContent"

export default function ProfilePage() {
  const { id } = useParams()
  return <ProfileContent key={id ?? "me"} />
}

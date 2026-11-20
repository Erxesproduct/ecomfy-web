import Link from "next/link";
import { Star } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="wrap dots relative py-24 text-center">
      <Star className="mx-auto h-14 w-14 text-sun-d" />
      <h1 className="mt-8 text-[34px] md:text-[52px]">
        Энэ хуудас <span className="script text-tomato-d">олдсонгүй</span>
      </h1>
      <p className="mt-3 text-ink-2">Хаяг буруу эсвэл бараа шилжсэн байж магадгүй. Хайлтаар эсвэл ангиллаар хайгаарай.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-plum">
          Бүх бараа
        </Link>
        <Link href="/" className="btn btn-light">
          Нүүр хуудас
        </Link>
      </div>
    </div>
  );
}

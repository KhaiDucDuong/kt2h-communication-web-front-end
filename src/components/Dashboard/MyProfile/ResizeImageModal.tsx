"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/cropImgDialog";
import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { PROFILE_IMG_INPUT_ID } from "./MyProfileModal";
import { Slider } from "../../ui/cropImageSlider";
import { degreesToRadians, rotateSize } from "@/utils/cropImageUtils";

interface ResizeImageModalProps {
  show: boolean;
  img: File;
  imgPath: string;
  imgType: string;
  outputWidth: number;
  outputHeight: number;
  setImgFile: React.Dispatch<React.SetStateAction<File | undefined>>;
  setOutputCroppedImg: React.Dispatch<React.SetStateAction<Blob | null>>;
  setOutputCroppedImgUrl: React.Dispatch<React.SetStateAction<string>>;
  setIsEditingImg: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const CROP_AREA_ASPECT = 1 / 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

const ResizeImageModal = (props: ResizeImageModalProps) => {
  const {
    show,
    img,
    imgPath,
    imgType,
    outputWidth,
    outputHeight,
    setImgFile,
    setOutputCroppedImg,
    setOutputCroppedImgUrl,
    setIsEditingImg,
    setError,
  } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedImg, setCroppedImg] = useState<Area | null>();

  function onCropComplete(_: Area, croppedAreaPixels: Area) {
    setCroppedImg(croppedAreaPixels);
  }

  function onCancel(e?: React.MouseEvent) {
    setIsEditingImg(false);
  }

  function onApply(e?: React.MouseEvent) {
    try {
      if (!croppedImg) {
        throw new Error("Cropped image is null");
      }
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context is null");
      }

      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const { boxWidth, boxHeight } = rotateSize(
          image.width,
          image.height,
          rotation
        );
        const rotRad = degreesToRadians(rotation);
        canvas.width = boxWidth;
        canvas.height = boxHeight;

        ctx.translate(boxWidth / 2, boxHeight / 2);
        ctx.rotate(rotRad);
        ctx.translate(-image.width / 2, -image.height / 2);
        ctx.drawImage(image, 0, 0);

        const data = ctx.getImageData(
          croppedImg.x,
          croppedImg.y,
          croppedImg.width,
          croppedImg.height
        );

        // set canvas width to final desired crop size - this will clear existing context
        canvas.width = croppedImg.width;
        canvas.height = croppedImg.height;

        ctx.putImageData(data, 0, 0);

        return new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) throw new Error("Final blob is empty");
            setOutputCroppedImg(blob);
            setOutputCroppedImgUrl(URL.createObjectURL(blob));
            setIsEditingImg(false);
          }, imgType);
        });
      };

      image.src = imgPath;
    } catch (error) {
      setError("Fail to save image.");
      console.log(error);
    }
  }

  return (
    <Dialog
      open={show}
      onOpenChange={() => {
        setIsEditingImg(!show);
        // setImgFile(undefined);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="min-w-fit bg-dark-9 text-gray-2 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 shadow-2xl ring-0 border-0 focus-visible:ring-offset-0 focus-visible:ring-0"
      >
        <DialogHeader className="flex justify-start text-[18px] self-start w-[600px] max-md:w-[480px] max-sm:w-[360px]">
          <p className="w-fit">Edit Image</p>
        </DialogHeader>
        <DialogDescription className="flex flex-col w-full">
          <div className="relative h-[400px] w-full ">
            <Cropper
              image={imgPath}
              aspect={CROP_AREA_ASPECT}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
              showGrid={false}
              cropShape={"round"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <Slider
            defaultValue={[zoom]}
            value={[zoom]}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.1}
            onValueChange={(value) => setZoom(value[0])}
            className="my-[24px]"
          />
        </DialogDescription>
        <DialogFooter className="w-full h-[48px] p-[16px] pb-0 pr-0 flex justify-end">
          <button
            onClick={onCancel}
            className="hover:underline h-auto mr-[12px] px-[16px] py-[2px]"
          >
            Cancel
          </button>
          <button
            className="px-[16px] py-[2px] bg-blue-2 hover:bg-purple-1 transition rounded-[3px]"
            onClick={onApply}
          >
            Apply
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ResizeImageModal;

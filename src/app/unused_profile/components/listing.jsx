/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

function Listing({ listing, id, onEdit, onDelete }) {
  return (
    <li className="categoryListing">
      <Link href={`/category/${listing.type}/${id}`} className="categoryListingLink">
        <img src={listing.imgUrls[0]} alt={listing.name} className="categoryListingImg" />
        <div className="categoryListingDetails">
          <p className="categoryListingLocation">{listing.location}</p>
          <p className="categoryListingName">{listing.name}</p>

          <p className="categoryListingPrice">
            $
            {listing.offer
              ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / Month"}
          </p>
          <div className="categoryListingInfoDiv">
            Bedicon
            <p className="categoryListingInfoText">{listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : "1 Bedroom"}</p>
            bathtubIcon
            <p className="categoryListingInfoText">{listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : "1 Bathroom"}</p>
          </div>
        </div>
      </Link>

      {onDelete && (
        <button className="button" fill="rgb(231, 76,60)" onClick={() => onDelete(listing.id, listing.name)}>
          Slet
        </button>
      )}

      {onEdit && (
        <button className="button" onClick={() => onEdit(id)}>
          Ret
        </button>
      )}
    </li>
  );
}

export default Listing;

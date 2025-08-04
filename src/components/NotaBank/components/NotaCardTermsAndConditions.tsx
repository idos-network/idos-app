import GrantAccessDialog from './GrantAccessDialog';
import CardReadyDialog from './CardReadyDialog';

export default function NotaCardTermsAndConditions() {
  return (
    <div className="">
      <div className="md:px-20">
        {/* Header */}
        <h1 className="text-5xl font-bold mb-12">NotaCard</h1>

        {/* Terms & Conditions Title */}
        <h2 className="text-2xl font-medium mb-8">Terms & Conditions</h2>

        {/* Introduction Text */}
        <p className="text-gray-300 mb-8 leading-relaxed">
          Please read the following terms before sharing your idOS profile. By
          sharing your idOS profile, you are agreeing to be bound by the idOS
          Terms and Conditions. If you choose to use AcmeCard, you are agreeing
          to be bound by the respective AcmeCard Terms and Conditions.
        </p>

        {/* Expandable Section */}
        <h3 className="text-xl font-medium text-green-400">
          NotABank Terms and Conditions
        </h3>

        {/* Content Paragraphs */}
        <div className="space-y-6 mb-12 text-gray-300 leading-relaxed">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at
            massa non sem sollicitudin commodo. Praesent vel dolor mauris.
            Aliquam condimentum vitae risus sit amet vehicula. Pellentesque
            turpis sem, rhoncus at euismod vel, vulputate in dui. Cras eleifend
            tempus lectus id tempor. Nullam mauris metus, tincidunt a enim
            lobortis, gravida ultrices odio. Maecenas ultrices, neque in aliquam
            semper, orci ligula pharetra libero, in gravida libero dui ac
            tellus. Fusce sollicitudin turpis elit, ut posuere sapien blandit
            vel.
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at
            massa non sem sollicitudin commodo. Praesent vel dolor mauris.
            Aliquam condimentum vitae risus sit amet vehicula. Pellentesque
            turpis sem, rhoncus at euismod vel, vulputate in dui. Cras eleifend
            tempus lectus id tempor. Nullam mauris metus, tincidunt a enim
            lobortis, gravida ultrices odio. Maecenas ultrices, neque in aliquam
            semper, orci ligula pharetra libero, in gravida libero dui ac
            tellus. Fusce sollicitudin turpis elit, ut posuere sapien blandit
            vel.
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at
            massa non sem sollicitudin commodo. Praesent vel dolor mauris.
            Aliquam condimentum vitae risus sit amet vehicula. Pellentesque
            turpis sem, rhoncus at euismod vel, vulputate in dui. Cras eleifend
            tempus lectus id tempor. Nullam mauris metus, tincidunt a enim
            lobortis, gravida ultrices odio. Maecenas ultrices, neque in aliquam
            semper, orci ligula pharetra libero, in gravida libero dui ac
            tellus. Fusce sollicitudin turpis elit, ut posuere sapien blandit
            vel.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between">
          <CardReadyDialog />
          <GrantAccessDialog />
        </div>
      </div>
    </div>
  );
}

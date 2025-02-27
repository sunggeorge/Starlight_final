-- CreateTable
CREATE TABLE "category" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personPhotos" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT,
    "personId" SMALLINT,
    CONSTRAINT "personPhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rating" DOUBLE PRECISION,
    "servicePersonId" SMALLINT,
    "message" VARCHAR,
    "userId" SMALLINT,
    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicePerson" (
    "id" SMALLSERIAL NOT NULL,
    "name" TEXT,
    "price" DOUBLE PRECISION DEFAULT 0,
    "imageUrl" TEXT,
    "about" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "categoryId" SMALLINT,
    CONSTRAINT "servicePerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_name" TEXT,
    "last_name" TEXT,
    "imageUrl" TEXT,
    "email" TEXT,
    "uuid" UUID DEFAULT GEN_RANDOM_UUID(),
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT,
    "time" TEXT,
    "location" TEXT,
    "categoryId" SMALLINT,
    "personId" SMALLINT,
    "uuid" UUID DEFAULT GEN_RANDOM_UUID(),
    "amount" DOUBLE PRECISION DEFAULT 0,
    "status" TEXT DEFAULT '''Pending''::text',
    "paymentIntentId" TEXT,
    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderServices" (
    "id" SMALLSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT,
    "quantity" SMALLINT DEFAULT 0,
    "orderId" SMALLINT,
    CONSTRAINT "orderServices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "personPhotos"
    ADD CONSTRAINT "public_personPhotos_personId_fkey" FOREIGN KEY (
        "personId"
    )
        REFERENCES "servicePerson"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review"
    ADD CONSTRAINT "public_review_servicePersonId_fkey" FOREIGN KEY (
        "servicePersonId"
    )
        REFERENCES "servicePerson"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review"
    ADD CONSTRAINT "public_review_userId_fkey" FOREIGN KEY (
        "userId"
    )
        REFERENCES "user"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicePerson"
    ADD CONSTRAINT "public_servicePerson_categoryId_fkey" FOREIGN KEY (
        "categoryId"
    )
        REFERENCES "category"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order"
    ADD CONSTRAINT "public_order_categoryId_fkey" FOREIGN KEY (
        "categoryId"
    )
        REFERENCES "category"(
            "id"
        ) ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order"
    ADD CONSTRAINT "public_order_personId_fkey" FOREIGN KEY (
        "personId"
    )
        REFERENCES "servicePerson"(
            "id"
        ) ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderServices"
    ADD CONSTRAINT "public_orderServices_orderId_fkey" FOREIGN KEY (
        "orderId"
    )
        REFERENCES "order"(
            "id"
        ) ON DELETE CASCADE ON UPDATE CASCADE;
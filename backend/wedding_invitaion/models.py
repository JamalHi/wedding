from datetime import datetime, timezone as dt_timezone

from django.db import models

# Create your models here.

class Guest(models.Model):
    ATTENDANCE_CHOICES = [("yes", "Yes"), ("no", "No"), ("maybe", "Maybe")]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    attendance = models.CharField(max_length=10, choices=ATTENDANCE_CHOICES)
    guests = models.PositiveSmallIntegerField(default=1)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Venue(models.Model):
    """Editable venue-hall details shown on the public site. Singleton: always pk=1."""

    hall_name = models.CharField(max_length=100, default="القاعة الملكية")
    tagline = models.CharField(max_length=150, blank=True, default="أفخم قاعات المناسبات في دمشق")
    address = models.CharField(max_length=200, blank=True, default="دمشق، اتستراد المزة")
    phone = models.CharField(max_length=30, blank=True, default="+966 11 XXX XXXX")
    website = models.CharField(max_length=100, blank=True, default="rosepalace-riyadh.com")
    map_embed_url = models.URLField(
        max_length=1000, blank=True,
        default="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6504858736247!2d46.67255391499984!3d24.68773398413143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f03890d489399%3A0xba974d1c98e79fd5!2sKing%20Abdullah%20Road%2C%20Riyadh!5e0!3m2!1sar!2ssa!4v1620000000000!5m2!1sar!2ssa",
    )
    directions_url = models.URLField(
        max_length=500, blank=True,
        default="https://maps.google.com/?q=King+Abdullah+Road+Riyadh",
    )

    stat1_value = models.CharField(max_length=20, blank=True, default="500+")
    stat1_label = models.CharField(max_length=50, blank=True, default="طاقة استيعابيّة")
    stat2_value = models.CharField(max_length=20, blank=True, default="5★")
    stat2_label = models.CharField(max_length=50, blank=True, default="قاعة فاخرة")
    stat3_value = models.CharField(max_length=20, blank=True, default="3")
    stat3_label = models.CharField(max_length=50, blank=True, default="صالات أفراح")

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SiteMusic(models.Model):
    """Editable background-music file. Singleton: always pk=1."""

    audio_file = models.FileField(upload_to="music/", blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class GalleryImage(models.Model):
    ASPECT_CHOICES = [("square", "Square"), ("tall", "Tall"), ("wide", "Wide")]

    image = models.ImageField(upload_to="gallery/")
    label = models.CharField(max_length=100, blank=True)
    aspect = models.CharField(max_length=10, choices=ASPECT_CHOICES, default="square")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "id"]


class SiteSettings(models.Model):
    """Editable couple/date/story/program text shown across the public site. Singleton: always pk=1."""

    # الأسماء
    groom_name = models.CharField(max_length=50, default="جمال")
    bride_name = models.CharField(max_length=50, default="سوار")
    groom_father_name = models.CharField(max_length=100, blank=True, default="")
    bride_father_name = models.CharField(max_length=100, blank=True, default="")

    # الآية القرآنية في البطاقة الرئيسية
    hero_quran_verse = models.CharField(
        max_length=300, blank=True,
        default="وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
    )
    hero_quran_reference = models.CharField(max_length=50, blank=True, default="سورة الروم - الآية 21")

    # التاريخ والوقت (wedding_datetime هو المصدر الوحيد المعتمد للعدّ التنازلي وتنسيقات التاريخ الرقمية)
    wedding_datetime = models.DateTimeField(default=datetime(2026, 10, 10, 18, 0, 0, tzinfo=dt_timezone.utc))
    hero_date_line = models.CharField(max_length=100, blank=True, default="السبت، العاشر من أوكتوبر")
    hero_year_line = models.CharField(max_length=50, blank=True, default="ألفان وستة وعشرون")
    ceremony_time_range = models.CharField(max_length=50, blank=True, default="5:00 م - 10:00 م")
    doors_open_note = models.CharField(max_length=100, blank=True, default="الأبواب تُفتح الساعة 4:30 م")

    # قصتنا
    story_intro = models.CharField(max_length=200, blank=True, default="كل قصة حبٍّ جميلة، لكن قصتنا هي المفضّلة لدينا")

    milestone1_date = models.CharField(max_length=30, blank=True, default="03-09-2025")
    milestone1_title = models.CharField(max_length=100, blank=True, default="أول لقاء")
    milestone1_description = models.TextField(blank=True, default="تحت سماءٍ مرصّعة بالنجوم، تلاقت نظرتان فكانت أول حروف قصةٍ لم تُكتب بعد.")

    milestone2_date = models.CharField(max_length=30, blank=True, default="10-10-2025")
    milestone2_title = models.CharField(max_length=100, blank=True, default="ليلة الخطبة")
    milestone2_description = models.TextField(blank=True, default="ليلةٌ لمع فيها الخاتم على الإصبع، وكان بريق العيون أصدق من بريق الذهب.")

    milestone3_date = models.CharField(max_length=30, blank=True, default="10-10-2026")
    milestone3_title = models.CharField(max_length=100, blank=True, default="بداية الأبد")
    milestone3_description = models.TextField(blank=True, default="ها هي اللحظة التي طال انتظارها: أن تتحوّل القصة إلى عهدٍ، والحب إلى رحلةٍ تدوم إلى الأبد.")

    # برنامج الحفل
    program1_time = models.CharField(max_length=20, blank=True, default="5:00 م")
    program1_title = models.CharField(max_length=100, blank=True, default="استقبال الضيوف")
    program1_description = models.CharField(max_length=200, blank=True, default="استقبال حارّ مع المرطّبات والموسيقى الحيّة")

    program2_time = models.CharField(max_length=20, blank=True, default="6:00 م")
    program2_title = models.CharField(max_length=100, blank=True, default="حفل عقد القران")
    program2_description = models.CharField(max_length=200, blank=True, default="مراسم العقد المقدّس في القاعة الكبرى")

    program3_time = models.CharField(max_length=20, blank=True, default="7:00 م")
    program3_title = models.CharField(max_length=100, blank=True, default="جلسة تصوير تذكاريّة")
    program3_description = models.CharField(max_length=200, blank=True, default="توثيق اللحظات الجميلة مع العروسين")

    program4_time = models.CharField(max_length=20, blank=True, default="8:00 م")
    program4_title = models.CharField(max_length=100, blank=True, default="عشاء وسهرة الاحتفال")
    program4_description = models.CharField(max_length=200, blank=True, default="عشاء فاخر يليه رقص واحتفال بهيج")

    # التذييل
    footer_quote = models.CharField(
        max_length=300, blank=True,
        default="الزواج ليس اسماً؛ إنه فعلٌ. إنه الطريقة التي تُحبّ بها شريك حياتك كلّ يوم",
    )
    hashtag = models.CharField(max_length=50, blank=True, default="#جمال_وسوار_2026")

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj
